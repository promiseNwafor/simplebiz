import { Resend } from 'resend'
import { ngnFormatter } from '.'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
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
  const emailOptions = {
    attachments: [
      {
        filename: 'invoice.pdf',
        content: attachment,
      },
    ],
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Your Invoice',
    html: `<p>Please find your invoice attached. Click <a href="${domain}/invoice/${id}">here</a> to make payment</p>`,
  }

  return resend.emails.send(emailOptions)
}

export const sendInvoiceReminderEmail = async (id: string, email: string) => {
  const emailOptions = {
    from: 'onboarding@resend.dev',
    to: 'promisenwafor955@gmail.com',
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
    from: 'onboarding@resend.dev',
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
