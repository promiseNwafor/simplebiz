import capitalize from 'lodash/capitalize'
import useInvoiceMenus from '@/hooks/useInvoiceMenus'
import { Invoice } from '@/types'
import { formatDate, ngnFormatter } from '@/lib'
import ActionsDropdown from '@/components/reusables/ActionsDropdown'
import Modal from '@/components/reusables/Modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

const statusColor = {
  UNPAID: '#FFC107',
  PAID: '#19C98A',
  OVERDUE: '#F44336',
}

const statusBgColor = {
  UNPAID: '#FFF6DA',
  PAID: '#DCF7ED',
  OVERDUE: '#FDE3E1',
}

type InvoicesRowProps = {
  invoice: Invoice
  quantity?: number
  isDetailPage?: boolean
}

const InvoicesRow: React.FC<InvoicesRowProps> = ({
  invoice,
  quantity,
  isDetailPage = false,
}) => {
  const { modalAction, setModalAction, actionMenus } = useInvoiceMenus(
    invoice as any
  )
  const colorStatus = statusColor[invoice.status]
  const bgColorStatus = statusBgColor[invoice.status]

  return (
    <div className='grid grid-cols-12 text-xs font-medium p-4 border-b border-gray-200 items-center'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      <div>
        <Checkbox id={invoice.id} />
      </div>
      <div className='col-span-2'>{formatDate(invoice.issueDate)}</div>
      <div className='col-span-2'>{formatDate(invoice.dueDate)}</div>
      <div>{invoice.invoiceNo}</div>
      <div className='col-span-2'>{invoice.issuedTo}</div>
      <div className='col-span-2'>{ngnFormatter.format(invoice.amount)}</div>
      <div>
        <Badge
          variant='outline'
          style={{
            borderColor: colorStatus,
            color: colorStatus,
            backgroundColor: bgColorStatus,
          }}
        >
          {capitalize(invoice.status)}
        </Badge>
      </div>
      {isDetailPage ? (
        <div className='flex justify-center'>{quantity}</div>
      ) : (
        <div className='flex justify-end'>
          <ActionsDropdown menuItems={actionMenus} />
        </div>
      )}
    </div>
  )
}

export default InvoicesRow
