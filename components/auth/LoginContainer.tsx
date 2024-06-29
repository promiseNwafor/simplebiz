'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Checkbox } from '@radix-ui/react-checkbox'
import Link from 'next/link'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { useSearchParams } from 'next/navigation'

import { LoginFormValues, LoginFormSchema } from '@/schemas'
import { login } from '@/actions/login'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SocialsContainer from './SocialsContainer'
import { AuthError } from './AuthError'
import { AuthSuccess } from './AuthSuccess'
import OTPInputContainer from './OTPInputContainer'

const LoginContainer = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  })

  const { handleSubmit, control, reset } = form

  const onSubmit = (values: LoginFormValues) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            //  reset()
            setError(data.error)
          }

          if (data?.success) {
            reset()
            setSuccess(data.success)
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => setError('Something went wrong'))
    })
  }

  const errorMessage = error || urlError

  return (
    <div className='w-full max-w-lg space-y-10'>
      <div className='space-y-2'>
        <h2>Welcome to Simple Biz</h2>
        <p>Please sign in to continue</p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {showTwoFactor && (
              <OTPInputContainer control={control} isPending={isPending} />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Email'
                          type='email'
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Password'
                          type={showPassword ? 'text' : 'password'}
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <div className='relative'>
                        {showPassword ? (
                          <AiOutlineEye
                            className='absolute right-4 -top-9'
                            onClick={togglePasswordVisibility}
                          />
                        ) : (
                          <AiOutlineEyeInvisible
                            className='absolute right-4 -top-9'
                            onClick={togglePasswordVisibility}
                          />
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex items-center justify-between '>
                  <FormField
                    control={control}
                    name='rememberLogin'
                    render={({ field: { value, onChange } }) => (
                      <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox
                            checked={value}
                            onCheckedChange={onChange}
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel>Remember me</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div>
                    <Link href='/auth/reset' className='text-sm'>
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          {errorMessage && <AuthError message={errorMessage} />}
          {success && <AuthSuccess message={success} />}
          <Button type='submit' size='full' disabled={isPending}>
            Continue
          </Button>
        </form>
      </Form>
      <SocialsContainer />
      <div className='text-center'>
        Don’t have an account?
        <Link href='/auth/register' className='text-md ml-1'>
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default LoginContainer
