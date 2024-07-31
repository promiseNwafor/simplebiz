import { Payment } from '@prisma/client'
import usePaymentMenu from '@/hooks/usePaymentMenu'
import { formatDate, ngnFormatter } from '@/lib'
import Modal from '@/components/reusables/Modal'
import { Checkbox } from '@/components/ui/checkbox'

type PaymentsRowProps = {
  payment: Payment
  isDetailPage?: boolean
}

const PaymentsRow: React.FC<PaymentsRowProps> = ({
  payment,
  isDetailPage = false,
}) => {
  const { modalAction, setModalAction, actionMenus } = usePaymentMenu(payment)

  return (
    <div className='grid grid-cols-12 text-xs font-medium p-4 border-b border-gray-200 items-center'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      {isDetailPage ? (
        <>
          <div className='col-span-3 ml-3'>{payment.transactionNo}</div>
          <div className='col-span-3'>{formatDate(payment.paymentDate)}</div>
          <div className='col-span-3'>
            {ngnFormatter.format(payment.amount)}
          </div>
          <div className='col-span-3'>{payment.invoiceRef}</div>
        </>
      ) : (
        <>
          <div>
            <Checkbox id={payment.id} />
          </div>
          <div className='col-span-2'>{payment.transactionNo}</div>
          <div className='col-span-2'>{formatDate(payment.paymentDate)}</div>
          <div className='col-span-2'>
            {ngnFormatter.format(payment.amount)}
          </div>
          <div className='col-span-2'>{payment.invoiceRef}</div>
          <div className='col-span-3'>{payment.clientName}</div>
        </>
      )}
    </div>
  )
}

export default PaymentsRow
