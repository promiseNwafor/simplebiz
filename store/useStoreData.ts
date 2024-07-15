import {
  keepPreviousData,
  queryOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { ClientProps, GetResponse, Product } from '@/types'
import { getProducts } from './products'
import { getClients } from './clients'

export const productsQueryKeys = {
  getProducts: 'getProducts',
  getClients: 'getClients',
}

export const useGetClients = (page: number, itemsPerPage: number) => {
  return queryOptions({
    queryKey: [productsQueryKeys.getClients, page],
    queryFn: async () => {
      return await getClients(page, itemsPerPage)
    },
    placeholderData: keepPreviousData,
  })
}

// export const useGetClients = (
//   page: number,
//   itemsPerPage: number,
//   options?: UseQueryOptions<Product[], any>
// ): UseQueryResult<GetResponse<ClientProps[]>, Error> => {
//   const res = useQuery({
//     queryKey: [productsQueryKeys.getClients, page],
//     queryFn: async () => {
//       return await getClients(page, itemsPerPage)
//     },
//     placeholderData: keepPreviousData,
//   })

//   return res
// }

export const useGetProducts = (
  page: number,
  itemsPerPage: number,
  options?: UseQueryOptions<Product[], any>
) => {
  const res = useQuery({
    queryKey: [productsQueryKeys.getProducts, page],
    queryFn: async () => {
      return await getProducts(page, itemsPerPage)
    },
    // queryFn: async () => {
    //   const allProducts = await getAllProducts()
    //   if (allProducts.error) throw new Error(allProducts.error)
    //   if (allProducts.success) {
    //     return allProducts
    //   }
    // },
  })

  return res
}
