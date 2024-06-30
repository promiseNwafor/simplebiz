import GoToButton from '../GoToButton'
import ChartContainer from './ChartContainer'
import OverviewCard from './OverviewCard'

const featuredItems = [
  { label: 'No. of Clients', title: '100' },
  { label: 'Catalogue Size', title: '158' },
  { label: 'Pending Invoices', title: '17' },
  { label: ' Expired Invoices', title: '8' },
]

const DashboardContainer = () => {
  return (
    <>
      {/* Overview */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8'>
        {featuredItems.map((item) => {
          const { label, title } = item
          return <OverviewCard key={label} label={label} title={title} />
        })}
      </div>

      {/* Trend */}
      <div className='w-full grid lg:grid-cols-3 gap-8'>
        <ChartContainer />
        <div className='bg-white p-6 rounded-lg h-full flex flex-col justify-between gap-4'>
          <div className='grid md:grid-cols-2 lg:grid-cols-1 gap-6'>
            <OverviewCard
              label='Total Earnings'
              title='₦2,000,546'
              className='bg-primary-light pl-4'
              labelClassName='text-black'
            />
            <OverviewCard
              label='Estimated Future Earnings'
              title='₦480,025'
              className='bg-[#FFF6DA] pl-4'
              labelClassName='text-black'
            />
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-xs'>From 325 payments</p>
            <GoToButton>See all transactions</GoToButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardContainer
