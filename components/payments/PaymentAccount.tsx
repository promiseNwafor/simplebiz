import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PaymentDetail } from '@prisma/client'
import { PaymentAccountSchema, PaymentAccountSchemaValues } from '@/schemas'
import {
  useAddPaymentDetails,
  useEditPaymentDetails,
} from '@/store/useStoreData'
import { Form } from '@/components/ui/form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type PaymentAccountProps = {
  toggleModal: () => void
  accountDetails: PaymentDetail | undefined
}

const PaymentAccount: React.FC<PaymentAccountProps> = ({
  toggleModal,
  accountDetails,
}) => {
  const { mutateAsync: addDetails, isPending: isAddPending } =
    useAddPaymentDetails()
  const { mutateAsync: editDetails, isPending: isEditPending } =
    useEditPaymentDetails()

  const submitHandler = accountDetails ? editDetails : addDetails

  const form = useForm<PaymentAccountSchemaValues>({
    resolver: zodResolver(PaymentAccountSchema),
    defaultValues: {
      bankName: accountDetails?.bankName || undefined,
      accountNumber: accountDetails?.accountNumber || undefined,
      accountName: accountDetails?.accountName || undefined,
    },
  })

  const { handleSubmit, control } = form

  const onSubmit = async (values: PaymentAccountSchemaValues) => {
    try {
      const res = await submitHandler(values)
      if (res.error) {
        return toast.error(res.error)
      }

      toggleModal()
      return toast.success(res?.success)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={control}
          name='bankName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank</FormLabel>
              <FormControl>
                <Input placeholder='Enter your bank' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='accountNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account number</FormLabel>
              <FormControl>
                <Input placeholder='Account number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='accountName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account name</FormLabel>
              <FormControl>
                <Input placeholder='Account name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isAddPending || isEditPending}>
          Save
        </Button>
      </form>
    </Form>
  )
}

export default PaymentAccount
