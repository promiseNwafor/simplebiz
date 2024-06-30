import { currentUser } from '@/lib/auth'
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import AddButton from '@/components/AddButton'

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2'>
          Hi {user?.name.split(' ')[0]}{' '}
          <span className='hidden md:block'>👋</span>
        </h2>
        <AddButton>Generate Invoice</AddButton>
      </div>
      <DashboardContainer />
    </div>
  )
}
