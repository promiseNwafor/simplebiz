import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import ProvidersContainer from './providers'

const inter = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Simple Biz',
  description:
    'Enabling small businesses to manage their payments efficiently.',
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
            'min-h-screen bg-secondary font-sans antialiased',
            inter.variable
          )}
        >
          <ProvidersContainer>
            <Toaster />
            {children}
          </ProvidersContainer>
        </body>
      </html>
    </SessionProvider>
  )
}
