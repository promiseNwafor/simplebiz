import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { addProduct, deleteProduct, editProduct } from '@/actions/products'
import { ClientSchemaValues, ProductSchemaValues } from '@/schemas'
import { addClient, deleteClient, editClient } from '@/actions/clients'
import { getProduct, getProducts } from './products'
import { getClient, getClients } from './clients'

export const queryKeys = {
  getProducts: 'getProducts',
  getProduct: 'getProduct',
  getClients: 'getClients',
  getClient: 'getClient',
}

/** =============== Clients ============== */

export const useGetClients = (page: number) => {
  return queryOptions({
    queryKey: [queryKeys.getClients, page],
    queryFn: async () => {
      return await getClients(page)
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export const useGetClient = (id: string) => {
  return queryOptions({
    queryKey: [queryKeys.getClient, id],
    queryFn: async () => {
      return await getClient(id)
    },
  })
}

export const useAddClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ClientSchemaValues) => await addClient(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getClients] })
    },
  })
}

export const useEditClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string
      values: ClientSchemaValues
    }) => await editClient(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getClient, queryKeys.getClients],
      })
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => await deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getClient, queryKeys.getClients],
      })
    },
  })
}

/** =============== Products ============== */

export const useGetProducts = (page: number) => {
  return queryOptions({
    queryKey: [queryKeys.getProducts, page],
    queryFn: async () => {
      const res = await getProducts(page)
      if (res.success) return res
      if (res.error) throw new Error(res.error)

      return res
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export const useGetProduct = (id: string) => {
  return queryOptions({
    queryKey: [queryKeys.getProduct, id],
    queryFn: async () => {
      return await getProduct(id)
    },
  })
}

export const useAddProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ProductSchemaValues) => await addProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getProducts] })
    },
  })
}

export const useEditProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string
      values: ProductSchemaValues
    }) => await editProduct(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getProduct, queryKeys.getProducts],
      })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => await deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getProduct, queryKeys.getProducts],
      })
    },
  })
}
