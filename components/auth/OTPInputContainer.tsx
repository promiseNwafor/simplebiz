'use client'

import { Control } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { LoginFormValues } from '@/schemas'

interface IOTPInputContainer {
  control: Control<LoginFormValues>
  isPending: boolean
}

const OTPInputContainer: React.FC<IOTPInputContainer> = ({
  control,
  isPending,
}) => {
  return (
    <>
      <FormField
        control={control}
        name='code'
        render={({ field }) => (
          <FormItem>
            <FormLabel>OTP</FormLabel>
            <FormControl>
              <InputOTP maxLength={6} disabled={isPending} {...field}>
                <InputOTPGroup className='grid grid-cols-6 w-full gap-5'>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormDescription>
              Didn’t receive code? Resend in{' '}
              <span className='text-primary'>02:13</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default OTPInputContainer
