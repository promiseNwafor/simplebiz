'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { BackButton } from '@/components/auth/BackButton'
import SocialsContainer from './SocialsContainer'
import { AuthHeader } from './AuthHeader'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <div className='min-h-screen centered'>
      <Card className='w-[400px] shadow-md'>
        <CardHeader>
          <AuthHeader label={headerLabel} />
        </CardHeader>
        <CardContent>{children}</CardContent>
        {showSocial && (
          <CardFooter>
            <SocialsContainer />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  )
}
