import { UserRole } from '@prisma/client'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      role: UserRole
      isTwoFactorEnabled: boolean
      isOAuth: boolean
      phone: string
      address: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: UserRole
    phone: string | null
    address: string | null
  }
}
