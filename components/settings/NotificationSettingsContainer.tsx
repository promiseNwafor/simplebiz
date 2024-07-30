import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Reminder } from '@prisma/client'
import { RemindersFormSchema, RemindersFormValues } from '@/schemas'
import { useSetReminders } from '@/store/useUserData'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

type NotificationSettingsContainerProps = {
  reminder: Reminder
}

const NotificationSettingsContainer: React.FC<
  NotificationSettingsContainerProps
> = ({ reminder }) => {
  const { mutateAsync: setReminders, isPending } = useSetReminders()

  const enableReminders = reminder.enableReminders

  const form = useForm<RemindersFormValues>({
    resolver: zodResolver(RemindersFormSchema),
    defaultValues: { enableReminders: enableReminders || undefined },
  })

  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = form

  const onSubmit = async (values: RemindersFormValues) => {
    try {
      const res = await setReminders(values)

      if (res.error) {
        return toast.error(res.error)
      }

      return toast.success(res.success)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong!')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6'
        autoComplete='off'
      >
        <div className='space-y-3 py-5 w-full'>
          <p className='text-2xl font-semibold'>Reminder Settings</p>
          <hr />
          <div className='space-y-6'>
            <p className='text-lg font-medium'>Reminders</p>
            <FormField
              control={control}
              name='enableReminders'
              render={({ field: { value, onChange } }) => (
                <FormItem className='flex items-center space-x-2 space-y-0'>
                  <FormControl>
                    <Checkbox checked={value} onCheckedChange={onChange} />
                  </FormControl>
                  <FormLabel className='text-sm font-normal'>
                    Send automatic reminders
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isPending || !isDirty}>
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default NotificationSettingsContainer
