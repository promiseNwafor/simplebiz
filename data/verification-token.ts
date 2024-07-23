import { db } from '@/lib/db'

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    return verificationToken
  } catch {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    })

    return verificationToken
  } catch {
    return null
  }
}

export const getPaymentTokenByRef = async (ref: string) => {
  try {
    const paymentToken = await db.paymentToken.findFirst({
      where: { ref },
    })

    return paymentToken
  } catch {
    return null
  }
}
