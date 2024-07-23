import { Payment } from '@prisma/client'
import useInvoiceMenus from '@/hooks/useInvoiceMenus'
import { formatDate, ngnFormatter } from '@/lib'
import ActionsDropdown from '@/components/reusables/ActionsDropdown'
import Modal from '@/components/reusables/Modal'
import { Checkbox } from '@/components/ui/checkbox'

type PaymentsRowProps = {
  payment: Payment
}

const PaymentsRow: React.FC<PaymentsRowProps> = ({ payment }) => {
  const { modalAction, setModalAction, actionMenus } = useInvoiceMenus(
    payment as any
  )

  return (
    <div className='grid grid-cols-12 text-xs font-medium p-4 border-b border-gray-200 items-center'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      <div>
        <Checkbox id={payment.id} />
      </div>
      <div className='col-span-2'>{payment.transactionNo}</div>
      <div className='col-span-2'>{formatDate(payment.paymentDate)}</div>
      <div className='col-span-2'>{ngnFormatter.format(payment.amount)}</div>
      <div className='col-span-2'>{payment.invoiceRef}</div>
      <div className='col-span-2'>{payment.clientName}</div>
      <div className='flex justify-end'>
        <ActionsDropdown menuItems={actionMenus} />
      </div>
    </div>
  )
}

export default PaymentsRow
