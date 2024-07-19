import { ClientNameAndBiz } from '@/types'
import { SelectedProducts } from './InvoiceForm'

interface IInvoiceDocument {
  client: ClientNameAndBiz & { email: string }
  products: SelectedProducts[]
  totalAmount: number
}

const InvoiceDocument: React.FC<IInvoiceDocument> = () => <div>Pdf</div>

export default InvoiceDocument
