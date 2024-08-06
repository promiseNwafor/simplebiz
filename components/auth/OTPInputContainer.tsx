'use client'

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { Control, UseFormWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { LoginFormValues } from '@/schemas'
import { resend2FA } from '@/actions/login'
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
import { Button } from '@/components/ui/button'

interface IOTPInputContainer {
  control: Control<LoginFormValues>
  watch: UseFormWatch<LoginFormValues>
  email: string
  setError: Dispatch<SetStateAction<string | undefined>>
}

const OTPInputContainer: React.FC<IOTPInputContainer> = ({
  control,
  watch,
  email,
  setError,
}) => {
  const initialTime = 3600 // 1 hour in seconds
  const [seconds, setSeconds] = useState(initialTime)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [seconds])

  useEffect(() => {
    watch('code')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  const handleResend = async () => {
    setSeconds(initialTime)
    startTransition(() => {
      resend2FA(email)
        .then(() => {
          toast.success('New code has been sent!')
        })
        .catch((err) => setError(err.message || 'Something went wrong'))
    })
  }

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
              <span className='text-primary'>{formatTime(seconds)}</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {seconds <= 5 && (
        <Button type='button' onClick={handleResend} disabled={isPending}>
          Resend code
        </Button>
      )}
    </>
  )
}

export default OTPInputContainer
