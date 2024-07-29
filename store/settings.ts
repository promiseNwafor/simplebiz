import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const getBusiness = async () => {
  try {
    const user = await currentUser()

    if (!user) {
      return {
        error: 'User not found!',
      }
    }

    const business = await db.business.findUnique({
      where: {
        userId: user.id,
      },
    })

    return { data: business, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting business details!', success: false }
  }
}

export const getRemindersSettings = async () => {
  try {
    const user = await currentUser()

    const data = await db.reminder.findUnique({
      where: {
        userId: user.id,
      },
    })

    return { data, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting reminders!', success: false }
  }
}
