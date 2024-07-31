import { BeatLoader } from 'react-spinners'
import { Payment } from '@prisma/client'
import { GetResponse } from '@/types'
import PaymentsRow from './PaymentsRow'

type PaymentsTableProps = {
  data: GetResponse<Payment[]>
  isPending: boolean
  payments: Payment[]
  isDetailPage?: boolean
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  data,
  isPending,
  payments,
  isDetailPage,
}) => {
  return (
    <div className='min-h-[280px]'>
      {isPending ? (
        <BeatLoader color='#008678' className='text-center mt-6' />
      ) : (
        <>
          {data?.error || !payments || !payments.length ? (
            <div className='bg-white w-full h-[280px] py-5 centered border-t border-gray-200'>
              <p>No payment available</p>
            </div>
          ) : (
            <>
              {payments.map((payment) => {
                return (
                  <PaymentsRow
                    key={payment.id}
                    payment={payment}
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

export default PaymentsTable
