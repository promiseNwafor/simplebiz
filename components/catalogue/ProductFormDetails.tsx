import { Control } from 'react-hook-form'
import capitalize from 'lodash/capitalize'

import { ProductSchemaValues } from '@/schemas'
import { ProductType } from '@/enums'
import { Button } from '@/components/ui/button'
import {
  FormControl,
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

type ProductFormDetailsProps = {
  control: Control<ProductSchemaValues>
  onSubmit: () => void
}

const ProductFormDetails: React.FC<ProductFormDetailsProps> = ({
  control,
  onSubmit,
}) => {
  return (
    <>
      <FormField
        control={control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product name</FormLabel>
            <FormControl>
              <Input placeholder='Name' id={field.name} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='type'
        render={({ field: { value, onChange, name } }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={onChange} defaultValue={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent id={name}>
                {Object.values(ProductType).map((option) => (
                  <SelectItem key={option} value={option}>
                    {capitalize(option)}
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
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product description</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Description'
                className='resize-none'
                id={field.name}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='price'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                placeholder='0'
                type='number'
                min={0}
                id={field.name}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='quantity'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input
                placeholder='0'
                type='number'
                id={field.name}
                min={0}
                {...field}
                value={field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type='button' onClick={onSubmit} size='full'>
        Save
      </Button>
    </>
  )
}

export default ProductFormDetails
