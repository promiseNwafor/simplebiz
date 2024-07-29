'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { update } from '@/auth'
import { db } from '@/lib/db'
import {
  BusinessFormSchema,
  BusinessFormValues,
  RemindersFormSchema,
  RemindersFormValues,
  SettingsSchema,
  UserProfileFormSchema,
  UserProfileFormValues,
} from '@/schemas'
import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const updateUserProfile = async (values: UserProfileFormValues) => {
  try {
    const validatedFields = UserProfileFormSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const userData = validatedFields.data
    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {
      return { error: 'Unauthorized' }
    }

    if (user.email !== userData.email) {
      return { error: 'Sorry, you cannot change your email!' }
    }

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: userData.name,
        phone: userData.phoneNumber,
        address: userData.address,
      },
    })

    update({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
        role: updatedUser.role,
      },
    })

    return { success: 'Profile updated!' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}

export const setReminders = async (values: RemindersFormValues) => {
  try {
    const validatedFields = RemindersFormSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { enableReminders } = validatedFields.data

    const user = await currentUser()

    await db.reminder.upsert({
      where: {
        userId: user?.id,
      },
      create: {
        userId: user?.id,
        enableReminders,
      },
      update: {
        enableReminders,
      },
    })

    return { success: 'Reminders updated!' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}

export const updateBusiness = async (values: BusinessFormValues) => {
  try {
    const validatedFields = BusinessFormSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const businessValues = validatedFields.data
    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const business = await db.business.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (!business) {
      return { error: 'No business found!' }
    }

    await db.business.update({
      where: {
        id: business.id,
      },
      data: {
        name: businessValues.businessName,
        address: businessValues.businessAddress,
        registrationNumber: businessValues.rcNumber,
        description: businessValues.businessDescription,
        industry: businessValues.industry,
      },
    })

    return { success: 'Business updated!' }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  if (user.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' }
    }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return { success: 'Verification email sent!' }
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    )

    if (!passwordsMatch) {
      return { error: 'Incorrect password!' }
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedPassword
    values.newPassword = undefined
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  })

  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  })

  return { success: 'Settings Updated!' }
}
