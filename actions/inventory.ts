'use server'

import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { sendLowStockAlertEmail } from '@/lib/mail'
import { getLowStockProducts } from '@/store/inventory'

/**
 * Send low stock alert emails for all low stock products
 */
export const sendLowStockAlerts = async () => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Get low stock products
    const lowStockResult = await getLowStockProducts()

    if (lowStockResult.error || !lowStockResult.data) {
      return { error: 'Failed to get low stock products' }
    }

    const lowStockProducts = lowStockResult.data.data

    if (lowStockProducts.length === 0) {
      return { success: 'No low stock products found' }
    }

    // Get user email
    const userEmail = user.email

    if (!userEmail) {
      return { error: 'User email not found' }
    }

    // Map products to the format expected by sendLowStockAlertEmail
    const productsForEmail = lowStockProducts.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      lowStockThreshold: product.lowStockThreshold,
    }))

    // Send email with low stock products list
    const emailResult = await sendLowStockAlertEmail(
      userEmail,
      user.name || 'User',
      productsForEmail
    )

    if (emailResult?.error) {
      return { error: 'Failed to send low stock alert email' }
    }

    return {
      success: `Low stock alerts sent for ${lowStockProducts.length} product(s)`,
    }
  } catch (error) {
    console.error('Error sending low stock alerts:', error)
    return {
      error: `Error sending low stock alerts: ${(error as Error).message}`,
    }
  }
}

/**
 * Update product low stock threshold
 */
export const updateLowStockThreshold = async (
  productId: string,
  threshold: number
) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Verify product belongs to user
    const product = await db.product.findFirst({
      where: {
        id: productId,
        userId: user.id,
      },
    })

    if (!product) {
      return { error: 'Product not found or unauthorized' }
    }

    // Update threshold
    await db.product.update({
      where: { id: productId },
      data: { lowStockThreshold: threshold },
    })

    return { success: 'Low stock threshold updated successfully' }
  } catch (error) {
    console.error('Error updating low stock threshold:', error)
    return {
      error: `Error updating threshold: ${(error as Error).message}`,
    }
  }
}
