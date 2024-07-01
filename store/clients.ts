import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ClientProps, GetResponse } from '@/types'

export const getClients = async (): Promise<GetResponse<ClientProps[]>> => {
  try {
    const user = await currentUser()

    const data = await db.client.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        billingAddress: true,
        businessName: true,
        image: true,
        invoices: true,
      },
    })

    return { data, success: true }
  } catch (error) {
    console.error(error)
    // TODO: add error toast
    return { error: 'Error getting clients', success: false }
  }
}
