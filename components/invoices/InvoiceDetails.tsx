import { Control } from 'react-hook-form'
import { InvoiceSchemaValues } from '@/schemas'
import { useGetClientsNameAndBiz } from '@/store/useStoreData'
import { ClientNameAndBiz } from '@/types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type InvoiceDetailsProps = {
  control: Control<InvoiceSchemaValues>
  isPending: boolean
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  control,
  isPending,
}) => {
  const { data } = useGetClientsNameAndBiz()

  const clients =
    data?.data?.data ||
    ([{ id: '1#', name: 'No clients found' }] as ClientNameAndBiz[])

  return (
    <>
      <FormField
        control={control}
        name='client'
        render={({ field: { value, onChange, name } }) => (
          <FormItem>
            <FormLabel>Bill to</FormLabel>
            <Select onValueChange={onChange} defaultValue={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select client' />
                </SelectTrigger>
              </FormControl>
              <SelectContent id={name}>
                {clients.map((option, i) => (
                  <SelectItem key={`${option.id}-${i}`} value={option.id}>
                    {`${option.name} ${option.businessName && '-' + option.businessName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='dueDate'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Due date</FormLabel>
            <FormControl>
              <Input type='date' placeholder='dd/mm/yyyy' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='message'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email message</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Your message'
                className='resize-none'
                id={field.name}
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type='submit' disabled={isPending}>
        Send Invoice
      </Button>
    </>
  )
}

export default InvoiceDetails
