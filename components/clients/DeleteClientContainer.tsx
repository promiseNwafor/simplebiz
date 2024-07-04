import { useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { PostResponse } from '@/types'
import { Button } from '@/components/ui/button'

type DeleteClientContainerProps = {
  deleteHandler: () => Promise<PostResponse>
  toggleModal: () => void
}

const DeleteClientContainer: React.FC<DeleteClientContainerProps> = ({
  deleteHandler,
  toggleModal,
}) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async () => {
    startTransition(() => {
      deleteHandler()
        .then((res) => {
          if (res?.success) {
            router.push('/clients')
            toast.success('Clients table deleted successfully')
            toggleModal()
            return
          }

          toast.error(res?.error || 'Something went wrong!')
          return
        })
        .catch(() => {
          toast.error('Something went wrong!')
        })
    })
  }

  return (
    <div>
      <p className='text-sm leading-loose'>
        Are you sure you want to delete this client? This action cannot be
        reversed and all related info including invoices and payment history
        will be lost.
      </p>
      <div className='grid justify-end w-full mt-6'>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={isPending}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default DeleteClientContainer
