import { Resend } from 'resend'
import { ngnFormatter } from '.'

// Get environment variables with fallbacks
const domain =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_PRODUCTION_URL ||
  'http://localhost:3000'

const noreplyEmail =
  process.env.NEXT_PUBLIC_NO_REPLY_EMAIL ||
  'onboarding@resend.dev' // Resend default domain for testing

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Email functionality will not work.')
}

if (!noreplyEmail || noreplyEmail === 'onboarding@resend.dev') {
  console.warn(
    'Using default Resend email. Please set NEXT_PUBLIC_NO_REPLY_EMAIL or RESEND_FROM_EMAIL environment variable.'
  )
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  return await resend.emails.send({
    from: noreplyEmail,
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  const resetLink = `${domain}/auth/new-password?token=${token}`

  return await resend.emails.send({
    from: noreplyEmail,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  return await resend.emails.send({
    from: noreplyEmail,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  })
}

export const sendInvoiceEmail = async (
  id: string,
  email: string,
  attachment: string
) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  const emailOptions = {
    attachments: [
      {
        filename: 'invoice.pdf',
        content: attachment,
      },
    ],
    from: noreplyEmail,
    to: email,
    subject: 'Your Invoice',
    html: `<p>Please find your invoice attached. Click <a href="${domain}/invoice/${id}">here</a> to make payment</p>`,
  }

  return resend.emails.send(emailOptions)
}

export const sendInvoiceReminderEmail = async (id: string, email: string) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  const emailOptions = {
    from: noreplyEmail,
    to: email,
    subject: 'Invoice Payment Reminder',
    html: `<p>Hello, this is a gentle reminder to make payment for your invoice. Click <a href="${domain}/invoice/${id}">here</a> to make payment</p>`,
  }

  return resend.emails.send(emailOptions)
}

export const sendWithdrawalEmail = async (data: {
  withdrawalId: string
  email: string
  name: string
  amount: number
  accountName: string
  accountNumber: string
  bankName: string
}) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  const {
    withdrawalId,
    email,
    name,
    amount,
    accountName,
    accountNumber,
    bankName,
  } = data
  const options = {
    from: noreplyEmail,
    to: email,
    subject: 'Withdrawal Request',
    html: `<div>
    <p>${name} has requested the withdrawal of ${ngnFormatter.format(amount)}</p>
    <ul>
      <li>Bank name: ${bankName}</li>
      <li>Account number: ${accountNumber}</li>
      <li>Account name: ${accountName}</li>
    </ul>
    <p>Click <a href="${domain}/withdrawal/${withdrawalId}">here</a> to mark this transaction as complete. </p>
    </div>`,
  }

  return resend.emails.send(options)
}

export const sendWithdrawalCompleteEmail = async (data: {
  withdrawalRef: string
  email: string
  name: string
  amount: number
}) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  const { withdrawalRef, email, name, amount } = data
  const options = {
    from: noreplyEmail,
    to: email,
    subject: 'Your account has been credited by Simplebiz',
    html: `<div>
    <p>Hi ${name},</p>
    <p>your account has been credited with an amount of ${ngnFormatter.format(amount)} per your withdrawal request of ${withdrawalRef}</p>
    <p>Thank you</p>
    </div>`,
  }

  return resend.emails.send(options)
}

export const sendReceiptEmail = async (
  email: string,
  receiptPdf: string,
  transactionNo: number,
  invoiceRef: string
) => {
  if (!resend) {
    console.error('Resend is not configured')
    return { error: 'Email service not configured' }
  }

  const emailOptions = {
    attachments: [
      {
        filename: `Receipt-${transactionNo}-${invoiceRef}.pdf`,
        content: receiptPdf,
      },
    ],
    from: noreplyEmail,
    to: email,
    subject: `Payment Receipt - Transaction #${transactionNo}`,
    html: `<div>
    <p>Thank you for your payment!</p>
    <p>Please find your payment receipt attached.</p>
    <p>Transaction Number: #${transactionNo}</p>
    <p>Invoice Reference: ${invoiceRef}</p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br/>SimpleBiz Team</p>
    </div>`,
  }

  return resend.emails.send(emailOptions)
}
