import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from './auth.config'
import { db } from './lib/db'
import { getUserById } from './data/user'
import { UserRole } from '@prisma/client'

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      const existingUser = await getUserById(user.id as string)

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
        session.user.phone = token.phone
        session.user.address = token.address
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role
      token.phone = existingUser.phone
      token.address = existingUser.address

      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
