import { useCallback, useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { usePathname } from 'next/navigation'

enum SessionStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading',
}

type UseCurrentSession = {
  session: Session | null
  status: SessionStatus
}

// This hook doesn't rely on the session provider
export const useCurrentSession = (): UseCurrentSession => {
  const [session, setSession] = useState<Session | null>(null)
  // Change the default status to loading
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.LOADING)
  const pathName = usePathname()

  const retrieveSession = useCallback(async () => {
    try {
      const sessionData = await getSession()
      if (sessionData) {
        setSession(sessionData)
        setStatus(SessionStatus.AUTHENTICATED)
        return
      }

      setStatus(SessionStatus.UNAUTHENTICATED)
    } catch (error) {
      setStatus(SessionStatus.UNAUTHENTICATED)
      setSession(null)
    }
  }, [])

  useEffect(() => {
    // We only want to retrieve the session when there is no session
    if (!session) {
      retrieveSession()
    }

    // use the pathname to force a re-render when the user navigates to a new page
  }, [retrieveSession, session, pathName])

  return { session, status }
}

export const useCurrentUser = () => {
  const sessionData = useCurrentSession()

  return sessionData.session?.user
}
