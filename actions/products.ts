'use server'

import { revalidatePath } from 'next/cache'
import { ProductType } from '@prisma/client'
import { ProductSchema, ProductSchemaValues } from '@/schemas'
import { PostResponse } from '@/types'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'

export const addProduct = async (
  values: ProductSchemaValues
): Promise<PostResponse> => {
  try {
    const validatedFields = ProductSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const {
      name,
      description,
      price,
      purchasePrice,
      imageURL,
      type,
      quantity,
    } = validatedFields.data

    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized!' }
    }

    const existingProduct = await db.product.findFirst({
      where: {
        name,
      },
    })

    if (existingProduct) {
      return { error: 'Product already added!' }
    }

    await db.product.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name,
        description,
        price,
        imageURL,
        purchasePrice,
        type: type as ProductType,
        quantity,
      },
    })

    // revalidatePath('/products')

    return { success: 'Product added successfully' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}

export const editProduct = async (
  id: string,
  values: ProductSchemaValues
): Promise<PostResponse> => {
  try {
    const validatedFields = ProductSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const {
      name,
      description,
      price,
      purchasePrice,
      imageURL,
      type,
      quantity,
    } = validatedFields.data

    const product = await db.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      return { error: 'Product does not exist!' }
    }

    // Check if product already exists with the same name for the user
    const user = await currentUser()
    const existingProduct = await db.product.findFirst({
      where: {
        name,
        userId: user?.id,
      },
    })

    if (existingProduct && existingProduct.id !== id) {
      return { error: 'Product already exists!' }
    }

    await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        imageURL,
        purchasePrice,
        type: type as ProductType,
        quantity,
      },
    })

    revalidatePath('/products')

    return { success: 'Product updated successfully' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}

export const deleteProduct = async (id: string): Promise<PostResponse> => {
  try {
    await db.product.delete({
      where: {
        id,
      },
    })

    revalidatePath('/products')

    return { success: 'Product deleted successfully' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}
