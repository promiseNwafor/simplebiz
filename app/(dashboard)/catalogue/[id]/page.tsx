import { QueryClient } from '@tanstack/react-query'
import { useGetProduct } from '@/store/useStoreData'
import ProductContainer from '@/components/catalogue/ProductContainer'

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetProduct(params.id))

  return <ProductContainer id={params.id} />
}

export default ProductPage
