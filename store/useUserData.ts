import { getSession } from 'next-auth/react'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  BusinessFormValues,
  RemindersFormValues,
  UserProfileFormValues,
} from '@/schemas'
import {
  setReminders,
  updateBusiness,
  updateUserProfile,
} from '@/actions/settings'
import { getBusiness, getRemindersSettings } from './settings'

export const dataQueryKeys = {
  getCurrentUser: 'getCurrentUser',
  getBusiness: 'getBusiness',
  getRemindersSettings: 'getRemindersSettings',
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

export const useSetReminders = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: RemindersFormValues) =>
      await setReminders(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [dataQueryKeys.getRemindersSettings],
      })
    },
  })
}

export const useGetRemindersSettings = () => {
  return queryOptions({
    queryKey: [dataQueryKeys.getRemindersSettings],
    queryFn: async () => {
      const res = await getRemindersSettings()
      if (res.error) throw new Error(res.error)

      return res
    },
  })
}
