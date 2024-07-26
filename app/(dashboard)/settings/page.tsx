import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetBusiness, useGetCurrentUser } from '@/store/useUserData'
import SettingsContainer from '@/components/settings/SettingsContainer'

const SettingsPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetCurrentUser())
  await queryClient.prefetchQuery(useGetBusiness())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsContainer />
    </HydrationBoundary>
  )
}

export default SettingsPage
