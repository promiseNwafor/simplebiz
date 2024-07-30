'use server'

import { InvoiceStatus } from '@prisma/client'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { SalesDataRange } from '@/components/dashboard/ChartContainer'
import { formatDate } from '@/lib'

export const getDashboardData = async (range: SalesDataRange) => {
  try {
    const now = new Date()
    let startDate
    let endDate = now

    switch (range) {
      case 'last-7-days':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)

        break
      case 'last-month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'last-year':
        startDate = new Date(now.getFullYear() - 1, 0, 1)
        endDate = new Date(now.getFullYear() - 0, 1)
        break
      default:
        startDate = new Date(0)
        endDate = now
    }

    const user = await currentUser()

    // get No of clients for the user
    const clientsNo = await db.client.count({
      where: {
        userId: user?.id,
      },
    })

    // get No of products for the user
    const productsNo = await db.product.count({
      where: {
        userId: user?.id,
      },
    })

    // get No of pending invoices for the user
    const pendingInvoicesNo = await db.invoice.count({
      where: {
        userId: user?.id,
        status: InvoiceStatus.UNPAID,
      },
    })

    // get No of overdue invoices for the user
    const expiredInvoicesNo = await db.invoice.count({
      where: {
        userId: user?.id,
        status: InvoiceStatus.OVERDUE,
      },
    })

    // get total earnings for the user
    const totalEarnings = await db.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: user?.id,
        status: InvoiceStatus.PAID,
      },
    })

    // get No of payments for the user
    const paymentsNo = await db.payment.count({
      where: {
        userId: user?.id,
      },
    })

    // get wallet balance for the user
    const walletBalance = await db.wallet.aggregate({
      _sum: {
        balance: true,
      },
      where: {
        userId: user?.id,
      },
    })

    // get data for plotting sales trends by date
    const salesData = await db.payment.findMany({
      where: {
        userId: user?.id,
        paymentDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
      },
      orderBy: {
        paymentDate: 'asc',
      },
      select: {
        paymentDate: true,
        amount: true,
      },
    })

    let formattedData = salesData
    if (range === 'all-time') {
      // Group data by month and year
      const groupedData = salesData.reduce((acc, { paymentDate, amount }) => {
        const date = new Date(paymentDate)
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const key = `${month}/${year}`

        if (!acc[key]) {
          acc[key] = { paymentDate: key, amount: 0 }
        }
        acc[key].amount += amount

        return acc
      }, {})

      formattedData = Object.values(groupedData)

      // return { data: formattedData, success: true }
    }

    const data = {
      clientsNo,
      productsNo,
      pendingInvoicesNo,
      expiredInvoicesNo,
      totalEarnings: totalEarnings._sum.amount,
      paymentsNo,
      walletBalance: walletBalance._sum.balance,
      salesData: formattedData.map((item) => ({
        ...item,
        paymentDate: item.paymentDate,
      })),
    }

    return { data, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting dashboard data', success: false }
  }
}
