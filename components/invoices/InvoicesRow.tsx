import capitalize from 'lodash/capitalize'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Invoice } from '@/types'
import { formatDate, ngnFormatter } from '@/lib'
import { useDownloadInvoice } from '@/store/useStoreData'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  const { mutateAsync: downloadInvoice, isPending: isDownloadPending } =
    useDownloadInvoice()

  const colorStatus = statusColor[invoice.status]
  const bgColorStatus = statusBgColor[invoice.status]

  const handleDownload = async () => {
    try {
      const res = await downloadInvoice(invoice.id)
      if (res.error || !res.data) {
        return toast.error(res.error || 'Something went wrong!')
      }

      const { pdfBase64, fileName } = res.data

      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${pdfBase64}`
      link.download = fileName

      link.click()
    } catch (error) {
      console.error(error)
      return toast.error('Something went wrong!')
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
          <Button
            variant='ghost'
            onClick={handleDownload}
            disabled={isDownloadPending}
          >
            <Download size={16} opacity={0.5} />
          </Button>
        </div>
      )}
    </div>
  )
}

export default InvoicesRow
