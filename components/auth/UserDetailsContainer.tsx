import { useState } from 'react'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { Control } from 'react-hook-form'

import { RegisterFormValues } from '@/schemas'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface IUserDetailsContainer {
  control: Control<RegisterFormValues>
  onSubmit: () => void
  isRegister?: boolean
}

const UserDetailsContainer: React.FC<IUserDetailsContainer> = ({
  control,
  onSubmit,
  isRegister = true,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState)

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prevState) => !prevState)

  return (
    <>
      <FormField
        control={control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full name</FormLabel>
            <FormControl>
              <Input placeholder='Your full name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
                disabled={!isRegister}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='phoneNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone number</FormLabel>
            <FormControl>
              <Input placeholder='Phone number' type='tel' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='address'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder='Your address' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isRegister && (
        <>
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
          <FormField
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Confirm Password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                  />
                </FormControl>
                <div className='relative'>
                  {showConfirmPassword ? (
                    <AiOutlineEye
                      className='absolute right-4 -top-9'
                      onClick={toggleConfirmPasswordVisibility}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className='absolute right-4 -top-9'
                      onClick={toggleConfirmPasswordVisibility}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      <Button type='button' size='full' onClick={onSubmit}>
        Continue
      </Button>
    </>
  )
}

export default UserDetailsContainer
