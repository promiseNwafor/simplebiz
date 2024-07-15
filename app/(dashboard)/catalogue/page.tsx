import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetProducts } from '@/store/useStoreData'
import CatalogueContainer from '@/components/catalogue/CatalogueContainer'

interface ICataloguePage {
  searchParams: { page: string }
}

const CataloguePage: React.FC<ICataloguePage> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetProducts(page))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogueContainer />
    </HydrationBoundary>
  )
}

export default CataloguePage
