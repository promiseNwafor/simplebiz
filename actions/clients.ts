'use server'

import { revalidatePath } from 'next/cache'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { AddClientSchema, AddClientSchemaValues } from '@/schemas'
import { PostResponse } from '@/types'

export const addClient = async (
  values: AddClientSchemaValues
): Promise<PostResponse> => {
  try {
    const validatedFields = AddClientSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const user = await currentUser()
    const { name, email, phoneNumber, billingAddress, businessName } =
      validatedFields.data

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

    revalidatePath('/clients')

    return { success: 'Client added successfully' }
  } catch (error) {
    console.error(error)

    return { error: 'Something went wrong!' }
  }
}
