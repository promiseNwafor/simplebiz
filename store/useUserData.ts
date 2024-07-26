import { getSession } from 'next-auth/react'
import { queryOptions } from '@tanstack/react-query'
import { getBusiness } from './settings'

export const dataQueryKeys = {
  getCurrentUser: 'getCurrentUser',
  getBusiness: 'getBusiness',
}

export const useGetCurrentUser = () => {
  return queryOptions({
    queryKey: [dataQueryKeys.getCurrentUser],
    queryFn: async () => {
      const sessionData = await getSession()

      return sessionData
    },
  })
}

export const useGetBusiness = () => {
  return queryOptions({
    queryKey: [dataQueryKeys.getBusiness],
    queryFn: async () => {
      const res = await getBusiness()
      if (res.error) throw new Error(res.error)

      return res
    },
    refetchOnWindowFocus: false,
  })
}
