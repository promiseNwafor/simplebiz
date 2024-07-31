import capitalize from 'lodash/capitalize'
import { Download } from 'lucide-react'
import { Invoice } from '@/types'
import { formatDate, ngnFormatter } from '@/lib'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { downloadInvoice } from '@/actions/invoices'

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
  const colorStatus = statusColor[invoice.status]
  const bgColorStatus = statusBgColor[invoice.status]

  const handleDownload = async () => {
    try {
      const { content, fileName } = await downloadInvoice(invoice.id)
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download invoice', error)
    }
  }

  return (
    <div className='grid grid-cols-12 text-xs font-medium p-4 border-b border-gray-200 items-center'>
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
          <Button variant='ghost' onClick={handleDownload}>
            <Download size={16} opacity={0.5} />
          </Button>
        </div>
      )}
    </div>
  )
}

export default InvoicesRow
