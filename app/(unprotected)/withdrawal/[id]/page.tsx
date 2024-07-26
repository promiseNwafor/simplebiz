'use client'

import Image from 'next/image'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  useGetPendingWithdrawals,
  useUpdateWithdrawalStatus,
} from '@/store/useStoreData'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const WithdrawalPage = ({ params }: { params: { id: string } }) => {
  const { mutateAsync: updateWithdrawalStatus, isPending } =
    useUpdateWithdrawalStatus()
  const { data: pendingWithdrawals } = useQuery(useGetPendingWithdrawals())

  const router = useRouter()

  if (!pendingWithdrawals?.data?.amount) {
    return <div className='centered h-screen'>No pending status to update</div>
  }

  const updateStatus = async () => {
    try {
      const res = await updateWithdrawalStatus(params.id)
      if (res.error) {
        return toast.error(res.error)
      }

      toast.success(res?.success)
      return router.replace('/invoices')
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className='min-h-screen w-screen  bg-white centered'>
      <div className='space-y-8 w-full centered flex-col'>
        <Image
          src='/images/logo-colored.svg'
          alt='logo'
          width={208}
          height={32}
          priority
        />
        <Card className='w-full max-w-[428px] p-4 lg:px-6 lg:py-4 shadow-md mx-auto space-y-6 centered flex-col'>
          <p className='text-xl font-semibold text-center'>Action</p>
          <p className='text-sm text-center'>
            Make sure the transaction has been successfully completed before
            taking this action
          </p>
          <Button disabled={isPending} onClick={updateStatus}>
            Complete
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default WithdrawalPage
