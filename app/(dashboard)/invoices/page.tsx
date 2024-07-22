import { QueryClient } from '@tanstack/react-query'
import { useGetInvoices } from '@/store/useStoreData'
import InvoicesContainer from '@/components/invoices/InvoicesContainer'

// const client = {
//   id: 'clyn6ll8p00076eia8hc44je3',
//   name: 'Promise Nwafor',
//   email: 'misee4.nwafor@gmail.com',
//   billingAddress: '62 Walsall Street',
//   phone: '07471498444',
//   businessName: '',
//   image: null,
//   createdAt: '2024-07-15T16:10:52.489Z',
//   updatedAt: '2024-07-15T16:10:52.489Z',
//   userId: 'clydfqfp3000ayxn7zvcm6b5c',
// }

// const products = [
//   {
//     id: 'clyndlqwi000e6eiawwbcgw3n',
//     name: 'Television ',
//     price: 220000,
//     quantity: 1,
//     total: 220000,
//   },
//   {
//     id: 'clyndgxya000d6eia5rvu9ytz',
//     name: 'Handbag',
//     price: 740841.29,
//     quantity: 2,
//     total: 1481682.58,
//   },
// ]

// const totalAmount = 1481682.58

// const ref = generateInvoiceReference()
// const issued = new Date().toISOString()
// const due = new Date().toISOString()

const InvoicesPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetInvoices(1))
  // const pdfData = await generateInvoice({
  //   client,
  //   products,
  //   totalAmount,
  //   date: { due, issued },
  //   ref,
  // })

  return (
    <>
      <InvoicesContainer />
      {/* <InvoiceDocument pdfData={pdfData} /> */}
    </>
  )
}

export default InvoicesPage
