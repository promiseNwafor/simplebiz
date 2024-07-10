import CatalogueContainer from '@/components/catalogue/CatalogueContainer'
import { getProducts } from '@/store/products'

const CataloguePage = async () => {
  const data = await getProducts()

  console.log('++++++++++++++', data.data)

  return <CatalogueContainer products={data.data} />
}

export default CataloguePage
