import { getSession } from 'next-auth/react'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { getBusiness } from './settings'
import { BusinessFormValues, UserProfileFormValues } from '@/schemas'
import { updateBusiness, updateUserProfile } from '@/actions/settings'

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

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: UserProfileFormValues) =>
      await updateUserProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [dataQueryKeys.getCurrentUser],
      })
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

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: BusinessFormValues) =>
      await updateBusiness(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [dataQueryKeys.getBusiness],
      })
    },
  })
}
