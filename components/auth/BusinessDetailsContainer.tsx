import { Control } from 'react-hook-form'

import { RegisterFormValues } from '@/schemas'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface IBusinessDetailsContainer {
  control: Control<RegisterFormValues>
  isPending: boolean
  isRegister?: boolean
}

const industryOptions = [
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Retail', value: 'retail' },
  { label: 'Other', value: 'other' },
]

const BusinessDetailsContainer: React.FC<IBusinessDetailsContainer> = ({
  control,
  isPending,
  isRegister = true,
}) => {
  return (
    <>
      <FormField
        control={control}
        name='businessName'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business name</FormLabel>
            <FormControl>
              <Input placeholder='Business name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='businessAddress'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Address</FormLabel>
            <FormControl>
              <Input placeholder='Address' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='rcNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>RC number</FormLabel>
            <FormControl>
              <Input placeholder='Registration number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='businessDescription'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business description</FormLabel>
            <FormControl>
              <Textarea
                placeholder='A brief description about your business'
                className='resize-none'
                {...field}
              />
            </FormControl>
            <FormDescription>Optional</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='industry'
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <Select onValueChange={onChange} defaultValue={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select industry' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {isRegister && (
        <>
          <FormField
            control={control}
            name='acceptPolicy'
            render={({ field: { value, onChange } }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox checked={value} onCheckedChange={onChange} />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>
                    By signing up you accept our{' '}
                    <a href='#' target='_blank' rel='noreferrer'>
                      Terms{' '}
                    </a>
                    and{' '}
                    <a href='#' target='_blank' rel='noreferrer'>
                      Privacy policy
                    </a>
                    .
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </>
      )}
      <Button type='submit' size='full' disabled={isPending}>
        Submit
      </Button>
    </>
  )
}

export default BusinessDetailsContainer
