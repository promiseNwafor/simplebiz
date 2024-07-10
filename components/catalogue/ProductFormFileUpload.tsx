import { useState } from 'react'
import Image from 'next/image'
import { CloudUpload } from 'lucide-react'
import { Control } from 'react-hook-form'
import { ProductSchemaValues } from '@/schemas'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type ProductFormFileUploadProps = {
  control: Control<ProductSchemaValues>
  isPending: boolean
}

const ProductFormFileUpload: React.FC<ProductFormFileUploadProps> = ({
  control,
  isPending,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  return (
    <>
      <FormField
        control={control}
        name='imageURL'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Add a high product image for this item to clearly describe what it
              looks like
            </FormLabel>
            <FormControl>
              <div className='flex flex-col items-center justify-center gap-8 py-5'>
                {selectedImage ? (
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    width={200}
                    height={100}
                    alt='Selected'
                  />
                ) : (
                  <CloudUpload size={100} className='opacity-50 py-5' />
                )}
                <Input
                  type='file'
                  id={field.name}
                  accept='image/*'
                  onBlur={field.onBlur}
                  name={field.name}
                  onChange={(e) => {
                    const url = e.target.files ? e.target.files[0] : null
                    field.onChange(url)
                    setSelectedImage(url)
                  }}
                  ref={field.ref}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type='submit' size='full' disabled={isPending}>
        Submit
      </Button>
    </>
  )
}

export default ProductFormFileUpload
