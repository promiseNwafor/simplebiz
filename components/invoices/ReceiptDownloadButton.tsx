'use client'

import { useState } from 'react'
import { Download, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { downloadReceipt, sendReceipt } from '@/actions/receipts'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ReceiptDownloadButtonProps = {
  paymentId: string
  clientEmail?: string
}

export default function ReceiptDownloadButton({
  paymentId,
  clientEmail,
}: ReceiptDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const result = await downloadReceipt(paymentId)

      if (result.error || !result.data) {
        toast.error(result.error || 'Failed to generate receipt')
        return
      }

      const { pdfBase64, fileName } = result.data

      // Create download link
      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${pdfBase64}`
      link.download = fileName
      link.click()

      toast.success('Receipt downloaded successfully')
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast.error('Failed to download receipt')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!clientEmail) {
      toast.error('Client email not available')
      return
    }

    setIsSending(true)
    try {
      const result = await sendReceipt(paymentId, clientEmail)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Receipt sent via email successfully')
    } catch (error) {
      console.error('Error sending receipt:', error)
      toast.error('Failed to send receipt')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          disabled={isDownloading || isSending}
        >
          {(isDownloading || isSending) ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Download className='h-4 w-4' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
          <Download className='mr-2 h-4 w-4' />
          Download Receipt
        </DropdownMenuItem>
        {clientEmail && (
          <DropdownMenuItem onClick={handleSendEmail} disabled={isSending}>
            <Mail className='mr-2 h-4 w-4' />
            Email Receipt
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
