import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { auth } from '@/auth'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Simple Biz',
  description:
    'enabling small businesses to manage their payments efficiently.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang='en'>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            inter.variable
          )}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
