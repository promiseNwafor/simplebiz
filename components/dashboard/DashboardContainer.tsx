'use client'

import { useQuery } from '@tanstack/react-query'
import { BeatLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'
import { useGetDashboardData } from '@/store/useStoreData'
import { Pages } from '@/routes'
import { ngnFormatter } from '@/lib'
import { dashboardFeaturedItems } from '@/constants'
import AddButton from '@/components/reusables/AddButton'
import GoToButton from '@/components/reusables/GoToButton'
import OverviewCard from '@/components/reusables/OverviewCard'
import ChartContainer, { SalesDataRange } from './ChartContainer'
import { useState } from 'react'

const DashboardContainer = () => {
  const [range, setRange] = useState(SalesDataRange.ALL_TIME)

  const { data: dashboardData, isPending: dashboardIsPending } = useQuery(
    useGetDashboardData(range)
  )

  const handleRangeSelect = (range: SalesDataRange) => {
    setRange(range)
  }

  const router = useRouter()

  const dashboard = dashboardData?.data

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-end'>
        <AddButton>Generate Invoice</AddButton>
      </div>

      {dashboardData?.error ? (
        <p className='text-center'>{dashboardData.error}</p>
      ) : (
        <>
          {dashboardIsPending || !dashboard ? (
            <BeatLoader color='#008678' className='text-center mt-6' />
          ) : (
            <>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
                {dashboardFeaturedItems.map((item) => {
                  const { label, key } = item
                  return (
                    <OverviewCard
                      key={key}
                      label={label}
                      title={(dashboard as any)[key]}
                    />
                  )
                })}
              </div>

              {/* Trend */}
              <div className='w-full grid lg:grid-cols-3 gap-6'>
                <ChartContainer
                  salesData={dashboard.salesData}
                  handleRangeSelect={handleRangeSelect}
                  range={range}
                />
                <div className='bg-white p-6 rounded-lg h-full flex flex-col justify-between gap-4'>
                  <div className='grid md:grid-cols-2 lg:grid-cols-1 gap-6'>
                    <OverviewCard
                      label='Wallet Balance'
                      title={ngnFormatter.format(
                        dashboard.walletBalance as number
                      )}
                      className='bg-[#FFF6DA] pl-4'
                      labelClassName='text-black'
                    />
                    <OverviewCard
                      label='Total Earnings'
                      title={ngnFormatter.format(
                        dashboard.totalEarnings as number
                      )}
                      className='bg-primary-light pl-4'
                      labelClassName='text-black'
                    />
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-xs'>
                      From {dashboard.paymentsNo} payments
                    </p>
                    <GoToButton
                      onClick={() => {
                        router.push(Pages.PAYMENTS)
                      }}
                    >
                      See all transactions
                    </GoToButton>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default DashboardContainer
