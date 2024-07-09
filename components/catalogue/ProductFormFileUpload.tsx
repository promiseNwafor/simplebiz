import { Control, useController } from 'react-hook-form'
import { ProductSchemaValues } from '@/schemas'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import { CloudUpload } from 'lucide-react'
import { useCallback, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
// import ImageUploader from 'react-image-upload'
// import 'react-image-upload/dist/index.css'

type ProductFormFileUploadProps = {
  control: Control<ProductSchemaValues>
}

const ProductFormFileUpload: React.FC<ProductFormFileUploadProps> = ({
  control,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    console.log('++++++++++++++', {
      acceptedFiles,
      file: URL.createObjectURL(file),
    })
    if (file) {
      setSelectedImage(file)
      setPreviewImageURL(URL.createObjectURL(file))
    }
  }, [])

  const { field } = useController({
    name: 'imageURL',
    control,
    defaultValue: null,
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  })

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
              {/* <div
                {...getRootProps()}
                className='flex flex-col items-center justify-center gap-8 py-5 border border-dashed border-gray-300 rounded-md cursor-pointer'
              >
                <Input
                  {...getInputProps()}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
                {previewImageURL ? (
                  <Image
                    src={previewImageURL}
                    width={200}
                    height={100}
                    alt='Selected'
                  />
                ) : (
                  <p className='text-gray-500'>
                    Drag & drop an image here, or click to select one
                  </p>
                )}
              </div> */}
              <div className='flex flex-col items-center justify-center gap-8 py-5'>
                {selectedImage ? (
                  <Image
                    src={selectedImage}
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
                    const url = e.target.files
                      ? URL.createObjectURL(e.target.files[0])
                      : null
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
      <Button type='submit' size='full'>
        Submit
      </Button>
    </>
  )
}

export default ProductFormFileUpload
