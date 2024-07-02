import { useTransition } from 'react'
import { toast } from 'sonner'
import { PostResponse } from '@/types'
import { Button } from '../ui/button'

type DeleteClientContainerProps = {
  deleteHandler: () => Promise<PostResponse>
}

const DeleteClientContainer: React.FC<DeleteClientContainerProps> = ({
  deleteHandler,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(() => {
      deleteHandler()
        .then((res) => {
          if (res?.error) {
            toast.error(res.error)
            return
          }

          toast.success('Clients table deleted successfully')
        })
        .catch(() => {
          toast.error('Something went wrong')
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
