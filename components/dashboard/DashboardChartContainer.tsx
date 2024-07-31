'use client'

import { AreaChart, Area, XAxis } from 'recharts'
import { BadgeDollarSign, CalendarDays } from 'lucide-react'
import { SalesDataRange } from '@/constants'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
  amount: {
    label: 'Amount ₦',
    color: '#008678',
    icon: BadgeDollarSign,
  },
  paymentDate: {
    label: 'PaymentDate',
    color: '#008678',
    icon: CalendarDays,
  },
} satisfies ChartConfig

export type SalesData = { amount: number; paymentDate: string }[]

type ChartContainerProps = {
  salesData: SalesData
  handleRangeSelect: (range: SalesDataRange) => void
  range: SalesDataRange
}

const DashboardChartContainer: React.FC<ChartContainerProps> = ({
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
      <div className='h-[350px] min-w-[567px]'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
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
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type='monotone'
              dataKey='amount'
              stroke='#fff'
              fill='url(#colorUv)'
              fillOpacity={1}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

export default DashboardChartContainer
