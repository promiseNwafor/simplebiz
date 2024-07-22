interface IInvoiceDocument {
  pdfData: string
}

const InvoiceDocument: React.FC<IInvoiceDocument> = ({ pdfData }) => {
  return (
    <div>
      <h1 className='text-xl font-semibold'>Invoice</h1>
      {pdfData && (
        <div className='mt-6'>
          <embed
            src={`data:application/pdf;base64,${pdfData}`}
            type='application/pdf'
            width='100%'
            height='600px'
          />
        </div>
      )}
    </div>
  )
}

export default InvoiceDocument
