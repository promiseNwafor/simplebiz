'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetResponse, Product } from '@/types'

/**
 * Get products with low stock
 * A product is considered low stock if quantity <= lowStockThreshold
 * If lowStockThreshold is not set, defaults to 10
 */
export const getLowStockProducts = async (): Promise<
  GetResponse<Product[]>
> => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated', success: false }
    }

    // Get all products for the user
    const allProducts = await db.product.findMany({
      where: {
        userId: user.id,
        available: true, // Only check available products
      },
    })

    // Filter products that are low in stock
    const lowStockProducts = allProducts.filter((product) => {
      const threshold = product.lowStockThreshold ?? 10 // Default threshold is 10
      return product.quantity <= threshold
    })

    return {
      data: { data: lowStockProducts, count: lowStockProducts.length },
      success: true,
    }
  } catch (error) {
    console.error('Error getting low stock products:', error)
    return {
      error: `Error getting low stock products: ${(error as Error).message}`,
      success: false,
    }
  }
}

/**
 * Get count of low stock products
 */
export const getLowStockCount = async (): Promise<number> => {
  try {
    const user = await currentUser()

    if (!user) {
      return 0
    }

    const allProducts = await db.product.findMany({
      where: {
        userId: user.id,
        available: true,
      },
      select: {
        quantity: true,
        lowStockThreshold: true,
      },
    })

    const lowStockCount = allProducts.filter((product) => {
      const threshold = product.lowStockThreshold ?? 10
      return product.quantity <= threshold
    }).length

    return lowStockCount
  } catch (error) {
    console.error('Error getting low stock count:', error)
    return 0
  }
}
