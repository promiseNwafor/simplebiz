import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getAllProducts, getProducts } from '@/store/products'
import CatalogueContainer from '@/components/catalogue/CatalogueContainer'
import { productsQueryKeys } from '@/store/useStoreData'

interface ICataloguePage {
  searchParams: { page: string }
}

const itemsPerPage = 5

const CataloguePage: React.FC<ICataloguePage> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1

  const data = await getProducts(page, itemsPerPage)

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [productsQueryKeys.getProducts, page],
    queryFn: async () => await getProducts(page, itemsPerPage),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogueContainer productsData={data} itemsPerPage={itemsPerPage} />
    </HydrationBoundary>
  )
}

export default CataloguePage
