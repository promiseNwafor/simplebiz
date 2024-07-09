'use server'

import fs from 'fs/promises'
import { ProductSchema, ProductSchemaValues } from '@/schemas'
import { PostResponse } from '@/types'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { ProductType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const addProduct = async (
  values: ProductSchemaValues
): Promise<PostResponse> => {
  try {
    console.log('++++++++++++++', { values })
    const validatedFields = ProductSchema.safeParse(values)

    if (!validatedFields.success) {
      console.log('++++++++++++++', { validatedFields })

      return { error: 'Invalid fields!' }
    }

    const { name, description, price, imageURL, type, quantity } =
      validatedFields.data

    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized!' }
    }

    // const existingProduct = await db.product.findFirst({
    //   where: {
    //     name,
    //   },
    // })

    // if (existingProduct) {
    //   return { error: 'Product already added!' }
    // }

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
        type: type.toUpperCase() as ProductType,
        quantity,
      },
    })

    // clean the image url
    // await fs.mkdir('public/products', { recursive: true })
    // const imagePath = `public/products/${crypto.randomUUID()}-${imageURL?.file.name}`

    // await fs.writeFile(
    //   imagePath,
    //   Buffer.from(await imageURL?.file.arrayBuffer())
    // )
    revalidatePath('/products')

    return { success: 'Product added successfully' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}
