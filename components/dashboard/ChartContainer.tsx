'use client'

import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

export enum SalesDataRange {
  ALL_TIME = 'all-time',
  LAST_7_DAYS = 'last-7-days',
  LAST_MONTH = 'last-month',
  THIS_MONTH = 'this-month',
  THIS_YEAR = 'this-year',
  LAST_YEAR = 'last-year',
}

export type SalesData = { amount: number; paymentDate: string }[]

type ChartContainerProps = {
  salesData: SalesData
  handleRangeSelect: (range: SalesDataRange) => void
  range: SalesDataRange
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  salesData,
  handleRangeSelect,
  range,
}) => {
  return (
    <div className='lg:col-span-2 bg-white p-6 rounded-lg overflow-x-auto'>
      <div className='flex items-center gap-1'>
        <p className='font-semibold'>Sales Trend</p>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='capitalize text-primary hover:text-primary focus:text-primary'>
                {range}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='w-[150px] grid p-2'>
                  {Object.values(SalesDataRange).map((value) => (
                    <NavigationMenuLink
                      key={value}
                      className='capitalize text-black/90 text-xs font-medium'
                      asChild
                    >
                      <Button
                        variant='ghost'
                        onClick={() => handleRangeSelect(value)}
                      >
                        {value}
                      </Button>
                    </NavigationMenuLink>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className='h-[334px] min-w-[567px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={salesData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#19C98A' stopOpacity={0.9} />
                <stop offset='95%' stopColor='#19C98A' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey='paymentDate' />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='amount'
              stroke='#fff'
              fill='url(#colorUv)'
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartContainer
