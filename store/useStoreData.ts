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
import { SalesDataRange } from '@/constants'
import {
  getClientDetails,
  getClientPayments,
  getClients,
  getClientsNameAndBiz,
} from './clients'
import { getInvoiceById, getInvoices } from './invoices'
import {
  getProduct,
  getProductDetail,
  getProductInvoices,
  getProducts,
} from './products'
import {
  getPaymentDetails,
  getPayments,
  getPendingWithdrawals,
  getWalletDetails,
} from './payments'
import { getDashboardData, getSalesTrendData } from './dashboard'

export const storeQueryKeys = {
  getDashboardData: 'getDashboardData',
  getSalesTrendData: 'getSalesTrendData',
  getProducts: 'getProducts',
  getProduct: 'getProduct',
  getClients: 'getClients',
  getClientPayments: 'getClientPayments',
  getClientsNameAndBiz: 'getClientsNameAndBiz',
  getInvoices: 'getInvoices',
  getInvoice: 'getInvoice',
  getPayments: 'getPayments',
  getWalletDetails: 'getWalletDetails',
  getPaymentDetails: 'getPaymentDetails',
  getPendingWithdrawals: 'getPendingWithdrawals',
  getClientDetails: 'getClientDetails',
  getProductDetail: 'getProductDetail',
  getProductInvoices: 'getProductInvoices',
}

/** =============== Dashboard ============== */

export const useGetDashboardData = () => {
  return queryOptions({
    queryKey: [storeQueryKeys.getDashboardData],
    queryFn: async () => {
      return await getDashboardData()
    },
    refetchOnWindowFocus: false,
  })
}

export const useGetSalesTrendData = (range: SalesDataRange) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getSalesTrendData],
    queryFn: async () => {
      return await getSalesTrendData(range)
    },
  })
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

export const useGetClientPayments = (id: string) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getClientPayments, id],
    queryFn: async () => {
      return await getClientPayments(id)
    },
  })
}

export const useGetClientDetails = (id: string) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getClientDetails, id],
    queryFn: async () => {
      return await getClientDetails(id)
    },
  })
}

export const useAddClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ClientSchemaValues) => await addClient(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [storeQueryKeys.getClients] })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getDashboardData],
      })
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
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getClientDetails, id],
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
        queryKey: [storeQueryKeys.getClientDetails],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getClients],
      })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getDashboardData],
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

export const useGetProductDetail = (id: string) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getProductDetail, id],
    queryFn: async () => {
      return await getProductDetail(id)
    },
  })
}

export const useGetProductInvoices = (id: string) => {
  return queryOptions({
    queryKey: [storeQueryKeys.getProductInvoices, id],
    queryFn: async () => {
      return await getProductInvoices(id)
    },
  })
}

export const useAddProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ProductSchemaValues) => await addProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [storeQueryKeys.getProducts] })
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getDashboardData],
      })
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
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getDashboardData],
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
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getDashboardData],
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
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getDashboardData],
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
      queryClient.invalidateQueries({
        queryKey: [storeQueryKeys.getDashboardData],
      })
    },
  })
}
