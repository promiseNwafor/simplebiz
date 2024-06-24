'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Checkbox } from '@radix-ui/react-checkbox'
import Link from 'next/link'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

import { LoginFormValues, LoginFormSchema } from '@/lib/schemas'

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
import { login } from '@/actions/login'

const LoginContainer = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  })

  const { handleSubmit, control, trigger, getValues } = form

  const onSubmit = (values: LoginFormValues) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values).then((res) => {
        setError(res.error)
        setSuccess(res.success)
      })
    })
  }

  return (
    <div className='w-full max-w-lg space-y-10'>
      <div className='space-y-2'>
        <h2>Welcome to Simple Biz</h2>
        <p>Please sign in to continue</p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
                    <Checkbox checked={value} onCheckedChange={onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div>
              <Link href='/auth/reset' className='text-md'>
                Forgot password?
              </Link>
            </div>
          </div>
          {error && <AuthError message={error} />}
          {success && <AuthSuccess message={success} />}
          <Button type='submit' size='full' disabled={isPending}>
            Continue
          </Button>
        </form>
      </Form>
      <SocialsContainer />
      <div className='text-center'>
        Don’t have an account?
        <Link href='/register' className='text-md ml-1'>
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default LoginContainer
