import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetDashboardData } from '@/store/useStoreData'
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import { SalesDataRange } from '@/components/dashboard/ChartContainer'

export default async function DashboardPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetDashboardData(SalesDataRange.ALL_TIME))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardContainer />
    </HydrationBoundary>
  )
}
