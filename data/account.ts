import { db } from '@/lib/db'

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    })

    return account
  } catch {
    return null
  }
}

export const getBusinessDetail = async (userId: string) => {
  try {
    const business = await db.business.findFirst({
      where: { userId },
    })

    return business
  } catch {
    return null
  }
}
