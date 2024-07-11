import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetResponse, Product } from '@/types'

type GetProducts = (
  page: number,
  itemsPerPage: number
) => Promise<GetResponse<Product[]>>

export const getProducts: GetProducts = async (page, itemsPerPage) => {
  try {
    const user = await currentUser()
    const offset = (page - 1) * itemsPerPage

    const count = await db.product.count({
      where: {
        userId: user?.id,
      },
    })

    const data = await db.product.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: itemsPerPage,
    })

    return { data: { data, count }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting products', success: false }
  }
}
