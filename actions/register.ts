'use server'

import bcrypt from 'bcryptjs'
import { RegisterFormSchema, RegisterFormValues } from '@/lib/schemas'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'

export const register = async (values: RegisterFormValues) => {
  const validatedFields = RegisterFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const {
    email,
    password,
    name,
    address,
    phoneNumber,
    businessAddress,
    businessName,
    businessDescription,
    industry,
    rcNumber,
  } = validatedFields.data
  const hashPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'User already exists!' }
  }

  const user = await db.user.create({
    data: {
      address,
      email,
      name,
      password: hashPassword,
      phone: phoneNumber,
    },
  })

  // Extract business registration logic
  if (user) {
    await db.business.create({
      data: {
        userId: user.id,
        address: businessAddress,
        name: businessName, // TODO: make business name unique
        description: businessDescription,
        industry,
        registrationNumber: rcNumber,
      },
    })
  }

  // TODO: send verification token email

  return { success: 'Registration successful!' }
}
