'use server'

import { LoginFormSchema, LoginFormValues } from '@/lib/schemas'

export const login = async (values: LoginFormValues) => {
  console.log('++++++++++++++', values)
  const validatedFields = LoginFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data

  return { success: 'Login successful!' }
}
