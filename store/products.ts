import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const getProducts = async () => {
  try {
    const user = await currentUser()

    const data = await db.product.findMany({
      where: {
        userId: user?.id,
      },
    })

    return { data, count: data.length }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting products', success: false }
  }
}
