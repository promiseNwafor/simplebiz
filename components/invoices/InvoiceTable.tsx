import { GetResponse } from '@/types'
import { Invoice } from '@prisma/client'
import { BeatLoader } from 'react-spinners'
import InvoicesRow from './InvoicesRow'

type InvoiceTableProps = {
  data: GetResponse<Invoice[]>
  isPending: boolean
  invoices: Invoice[]
  isDetailPage?: boolean
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  data,
  isPending,
  invoices,
  isDetailPage,
}) => {
  return (
    <div className='min-h-[280px]'>
      {isPending ? (
        <BeatLoader color='#008678' className='text-center mt-6' />
      ) : (
        <>
          {data?.error || !invoices || !invoices.length ? (
            <div className='bg-white w-full h-[280px] py-5 centered border-t border-gray-200'>
              <p>No invoice available</p>
            </div>
          ) : (
            <>
              {invoices.map((invoice) => {
                return (
                  <InvoicesRow
                    key={invoice.id}
                    invoice={invoice as any}
                    isDetailPage={isDetailPage}
                  />
                )
              })}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default InvoiceTable
