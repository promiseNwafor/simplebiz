import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { SalesDataRange } from '@/constants'
import { useGetDashboardData } from '@/store/useStoreData'
import DashboardContainer from '@/components/dashboard/DashboardContainer'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { range: SalesDataRange }
}) {
  const range = searchParams.range || SalesDataRange.ALL_TIME

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetDashboardData(range))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardContainer />
    </HydrationBoundary>
  )
}
