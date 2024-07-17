'use client'

import { useState } from 'react'
import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import InvoicesRow from './InvoicesRow'
import InvoiceForm from './InvoiceForm'

const invoices = [
  {
    id: 'INV001',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    invoiceNo: '1001',
    issuedTo: 'John Doe',
    amount: 500.0,
    // outstanding: 200.0,
    status: 'UNPAID',
  },
  {
    id: 'INV002',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    invoiceNo: '1002',
    issuedTo: 'Jane Smith',
    amount: 300.0,
    // outstanding: 0.0,
    status: 'PAID',
  },
  {
    id: 'INV003',
    issueDate: '2024-01-25',
    dueDate: '2024-02-25',
    invoiceNo: '1003',
    issuedTo: 'Acme Corp',
    amount: 750.0,
    // outstanding: 750.0,
    status: 'OVERDUE',
  },
  {
    id: 'INV004',
    issueDate: '2024-01-30',
    dueDate: '2024-02-28',
    invoiceNo: '1004',
    issuedTo: 'Global Industries',
    amount: 1000.0,
    // outstanding: 500.0,
    status: 'PAID',
  },
  {
    id: 'INV005',
    issueDate: '2024-02-01',
    dueDate: '2024-03-01',
    invoiceNo: '1005',
    issuedTo: 'ABC Ltd',
    amount: 250.0,
    // outstanding: 250.0,
    status: 'UNPAID',
  },
  {
    id: 'INV006',
    issueDate: '2024-02-05',
    dueDate: '2024-03-05',
    invoiceNo: '1006',
    issuedTo: 'XYZ Inc',
    amount: 400.0,
    // outstanding: 100.0,
    status: 'UNPAID',
  },
  {
    id: 'INV007',
    issueDate: '2024-02-10',
    dueDate: '2024-03-10',
    invoiceNo: '1007',
    issuedTo: 'QWERTY Solutions',
    amount: 150.0,
    // outstanding: 0.0,
    status: 'PAID',
  },
  {
    id: 'INV008',
    issueDate: '2024-02-12',
    dueDate: '2024-03-12',
    invoiceNo: '1008',
    issuedTo: 'Acme Corp',
    amount: 800.0,
    // outstanding: 800.0,
    status: 'OVERDUE',
  },
  {
    id: 'INV009',
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    invoiceNo: '1009',
    issuedTo: 'Jane Smith',
    amount: 600.0,
    // outstanding: 200.0,
    status: 'UNPAID',
  },
  {
    id: 'INV010',
    issueDate: '2024-02-20',
    dueDate: '2024-03-20',
    invoiceNo: '1010',
    issuedTo: 'John Doe',
    amount: 350.0,
    // outstanding: 0.0,
    status: 'PAID',
  },
]

const InvoicesContainer = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  return (
    <div className='space-y-8'>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        content={
          <InvoiceForm
            toggleModal={toggleModal}
            // submitHandler={() => {}}
          />
        }
        title='Generate Invoice'
      />
      <div className='flex items-center justify-end'>
        <AddButton onClick={toggleModal}>Generate Invoice</AddButton>
      </div>
      <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
        <div className='p-5 pt-0'>
          <h4>Invoice</h4>
        </div>
        <div className='min-w-[900px]'>
          <div className='bg-secondary grid grid-cols-12 text-xs font-semibold p-4 border-b border-gray-200'>
            <div></div>
            <div className='col-span-2'>Issued Date</div>
            <div className='col-span-2'>Due Date</div>
            <div>Invoice No.</div>
            <div className='col-span-2'>Issued to</div>
            <div className='col-span-2'>Amount</div>
            <div>Status</div>
            <div></div>
          </div>

          <div className='min-h-[280px]'>
            {invoices.map((invoice) => {
              return <InvoicesRow key={invoice.id} invoice={invoice as any} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicesContainer
