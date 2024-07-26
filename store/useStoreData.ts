import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { addProduct, deleteProduct, editProduct } from '@/actions/products'
import {
  ClientSchemaValues,
  InvoiceSchemaValues,
  PaymentAccountSchemaValues,
  PaymentWithdrawalSchemaValues,
  ProductSchemaValues,
} from '@/schemas'
import { addClient, deleteClient, editClient } from '@/actions/clients'
import { Payment } from '@/types'
import {
  addPayment,
  addPaymentDetails,
  editPaymentDetails,
  requestWithdrawal,
  updateWithdrawalStatus,
} from '@/actions/payments'
import { sendInvoice } from '@/actions/invoices'
import { getClient, getClients, getClientsNameAndBiz } from './clients'
import { getInvoiceById, getInvoices } from './invoices'
import { getProduct, getProducts } from './products'
import {
  getPaymentDetails,
  getPayments,
  getPendingWithdrawals,
  getWalletDetails,
} from './payments'

export const storeQueryKeys = {
  getProducts: 'getProducts',
  getProduct: 'getProduct',
  getClients: 'getClients',
  getClient: 'getClient',
  getClientsNameAndBiz: 'getClientsNameAndBiz',
  getInvoices: 'getInvoices',
  getInvoice: 'getInvoice',
  getPayments: 'getPayments',
  getWalletDetails: 'getWalletDetails',
  getPaymentDetails: 'getPaymentDetails',
  getPendingWithdrawals: 'getPendingWithdrawals',
}

/** =============== Clients ============== */

export const useGetClients = (page: number) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getClients, page],
    queryFn: async () => {
      return await getClients(page)
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export const useGetClientsNameAndBiz = () => {
  return useQuery({
    queryKey: [storeQueryKeys.getClientsNameAndBiz],
    queryFn: async () => {
      return await getClientsNameAndBiz()
    },
    refetchOnWindowFocus: false,
  })
}

export const useGetClient = (id: string) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getClient, id],
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
      queryClient.invalidateQueries({ queryKey: [storeQueryKeys.getClients] })
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
        queryKey: [storeQueryKeys.getClient],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getClients],
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
        queryKey: [storeQueryKeys.getClient],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getClients],
      })
    },
  })
}

/** =============== Products ============== */

export const useGetProducts = (page: number) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getProducts, page],
    queryFn: async () => {
      const res = await getProducts(page)
      if (res.error) throw new Error(res.error)

      return res
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export const useGetProduct = (id: string) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getProduct, id],
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
      queryClient.invalidateQueries({ queryKey: [storeQueryKeys.getProducts] })
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
        queryKey: [storeQueryKeys.getProduct],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getProducts],
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
        queryKey: [storeQueryKeys.getProduct],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getProducts],
      })
    },
  })
}

/** =============== Invoices ============== */

export const useSendInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: InvoiceSchemaValues) => {
      const res = await sendInvoice(values)

      if (res.error) throw new Error(res.error)

      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getInvoices, 1],
      })
    },
  })
}

export const useGetInvoices = (page: number) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getInvoices, page],
    queryFn: async () => {
      const res = await getInvoices(page)
      if (res.success) return res
      if (res.error) throw new Error(res.error)

      return res
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export const useGetInvoice = (id: string) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getInvoice, id],
    queryFn: async () => {
      return await getInvoiceById(id)
    },
  })
}

/** =============== Payments ============== */

export const useAddPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: Payment) => await addPayment(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getPayments, 1],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getInvoices, 1],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getWalletDetails],
      })
    },
  })
}

export const useGetPayments = (page: number) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getPayments, page],
    queryFn: async () => {
      const res = await getPayments(page)
      if (res.success) return res
      if (res.error) throw new Error(res.error)

      return res
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export const useGetWalletDetails = () => {
  return queryOptions({
    queryKey: [storeQueryKeys.getWalletDetails],
    queryFn: async () => {
      const res = await getWalletDetails()
      if (res.success) return res
      if (res.error) throw new Error(res.error)

      return res
    },
    refetchOnWindowFocus: false,
  })
}

export const useAddPaymentDetails = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: PaymentAccountSchemaValues) =>
      await addPaymentDetails(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getPaymentDetails],
      })
    },
  })
}

export const useGetPaymentDetails = () => {
  return queryOptions({
    queryKey: [storeQueryKeys.getPaymentDetails],
    queryFn: async () => {
      const res = await getPaymentDetails()
      if (res.success) return res
      if (res.error) throw new Error(res.error)

      return res
    },
    refetchOnWindowFocus: false,
  })
}

export const useEditPaymentDetails = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: PaymentAccountSchemaValues) =>
      await editPaymentDetails(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getPaymentDetails],
      })
    },
  })
}

export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      values,
      balance,
    }: {
      values: PaymentWithdrawalSchemaValues
      balance: number
    }) => await requestWithdrawal(values, balance),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getPendingWithdrawals],
      })
    },
  })
}

export const useGetPendingWithdrawals = () => {
  return queryOptions({
    queryKey: [storeQueryKeys.getPendingWithdrawals],
    queryFn: async () => {
      const res = await getPendingWithdrawals()
      if (res.success) return res
      if (res.error) throw new Error(res.error)

      return res
    },
    refetchOnWindowFocus: false,
  })
}

export const useUpdateWithdrawalStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => await updateWithdrawalStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getPendingWithdrawals],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getWalletDetails],
      })
    },
  })
}