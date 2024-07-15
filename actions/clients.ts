'use server'

import { revalidatePath } from 'next/cache'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ClientSchema, ClientSchemaValues } from '@/schemas'
import { PostResponse } from '@/types'

export const addClient = async (
  values: ClientSchemaValues
): Promise<PostResponse> => {
  try {
    const validatedFields = ClientSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const user = await currentUser()
    const { name, email, phoneNumber, billingAddress, businessName } =
      validatedFields.data

    // Check if client email already exists for the user
    const existingClient = await db.client.findFirst({
      where: { email, userId: user.id },
    })

    if (existingClient) {
      return { error: 'Client already exists!' }
    }

    await db.client.create({
      data: {
        userId: user.id,
        name,
        email,
        phone: phoneNumber,
        billingAddress,
        businessName,
      },
    })

    revalidatePath('/clients?page=1')

    return { success: 'Client added successfully' }
  } catch (error) {
    console.error(error)

    return { error: 'Something went wrong!' }
  }
}

export const editClient = async (
  id: string,
  values: ClientSchemaValues
): Promise<PostResponse> => {
  try {
    const validatedFields = ClientSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { name, email, phoneNumber, billingAddress, businessName } =
      validatedFields.data

    const client = await db.client.findUnique({
      where: {
        id,
      },
    })

    if (!client) {
      return { error: 'Client does not exist!' }
    }

    // Check if updated email already exists for the user
    if (email && email !== client.email) {
      //  if email is updated
      const user = await currentUser()

      const existingClient = await db.client.findFirst({
        where: {
          email,
          userId: user.id,
        },
      })

      if (existingClient && existingClient.id !== client.id) {
        return { error: 'Email already in use by another client!' }
      }
    }

    await db.client.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone: phoneNumber,
        billingAddress,
        businessName,
      },
    })

    revalidatePath('/clients')

    return { success: 'Client updated successfully' }
  } catch (error) {
    console.error(error)

    return { error: 'Something went wrong!' }
  }
}

export const deleteClient = async (id: string): Promise<PostResponse> => {
  try {
    await db.client.delete({
      where: {
        id,
      },
    })

    revalidatePath('/clients')

    return { success: 'Client deleted successfully' }
  } catch (error) {
    console.error(error)

    return { error: 'Something went wrong!' }
  }
}
