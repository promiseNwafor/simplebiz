import { getProducts } from '@/store/products'
import CatalogueContainer from '@/components/catalogue/CatalogueContainer'

interface ICataloguePage {
  searchParams: { page: string }
}

const itemsPerPage = 5

const CataloguePage: React.FC<ICataloguePage> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1

  const data = await getProducts(page, itemsPerPage)

  return <CatalogueContainer productsData={data} itemsPerPage={itemsPerPage} />
}

export default CataloguePage
