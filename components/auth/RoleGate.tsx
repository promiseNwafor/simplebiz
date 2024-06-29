'use client'

import { UserRole } from '@prisma/client'

import { useCurrentRole } from '@/hooks/useCurrentRole'
import { AuthError } from './AuthError'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRole
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return (
      <AuthError message='You do not have permission to view this content!' />
    )
  }

  return <>{children}</>
}
