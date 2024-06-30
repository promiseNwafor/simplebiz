import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { auth } from '@/auth'
import { cn } from '@/lib/utils'
import './globals.css'
import NavbarContainer from '@/components/navigation/NavbarContainer'
import SidebarContainer from '@/components/navigation/SidebarContainer'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

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
          <Toaster />
          <div className='flex w-full relative'>
            <SidebarContainer />
            <div className='flex-1 lg:absolute left-60 right-0'>
              <NavbarContainer />
              <main className='p-4'>{children}</main>
            </div>
          </div>
        </body>
      </html>
    </SessionProvider>
  )
}
