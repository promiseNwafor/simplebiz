import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetPayments } from '@/store/useStoreData'
import PaymentsContainer from '@/components/payments/PaymentsContainer'

const PaymentsPage = async ({
  searchParams,
}: {
  searchParams: { page: string }
}) => {
  const page = parseInt(searchParams.page) || 1

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetPayments(page))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentsContainer />
    </HydrationBoundary>
  )
}

export default PaymentsPage
