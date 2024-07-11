import { getProduct } from '@/store/products'
import ProductContainer from '@/components/catalogue/ProductContainer'

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const data = await getProduct(params.id)

  return <ProductContainer data={data} />
}

export default ProductPage
