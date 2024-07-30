// import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { formatDate } from '@/lib'
// import { Bar, BarChart } from 'recharts'
import { ChartConfig, ChartContainer as Chart } from '@/components/ui/chart'

export enum SalesDataRange {
  ALL_TIME = 'all-time',
  LAST_7_DAYS = 'last-7-days',
  LAST_MONTH = 'last-month',
  THIS_MONTH = 'this-month',
  THIS_YEAR = 'this-year',
  LAST_YEAR = 'last-year',
}

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig

export type SalesData = { amount: number; paymentDate: string }[]

const filterData = (salesData: SalesData, range: SalesDataRange) => {
  const now = new Date()
  let startDate = new Date(now)
  let endDate = now

  switch (range) {
    case SalesDataRange.LAST_7_DAYS:
      startDate.setDate(now.getDate() - 7)
      break
    case SalesDataRange.LAST_MONTH:
      startDate.setMonth(now.getMonth() - 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0)
      break
    case SalesDataRange.THIS_MONTH:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case SalesDataRange.THIS_YEAR:
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    case SalesDataRange.LAST_YEAR:
      startDate = new Date(now.getFullYear() - 1, 0, 1)
      endDate = new Date(now.getFullYear() - 0, 1)
      break
    default:
      startDate = new Date(0)
  }

  return salesData
    .filter((data) => {
      const paymentDate = new Date(data.paymentDate)

      return paymentDate >= startDate && paymentDate < endDate
    })
    .map((data) => ({
      ...data,
      paymentDate: formatDate(new Date(data.paymentDate)),
    }))
}

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
  // const [range, setRange] = useState(SalesDataRange.ALL_TIME)

  const filteredData = filterData(salesData, range)

  console.log('++++++++++++++', { salesData, filteredData })

  return (
    <div className='lg:col-span-2 bg-white p-6 rounded-lg overflow-x-auto'>
      {/* <Chart config={chartConfig} className='min-h-[200px] w-full'>
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
          <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
        </BarChart>
      </Chart> */}
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
        {/* <ResponsiveContainer width='100%' height='100%'>
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
        </ResponsiveContainer> */}
      </div>
    </div>
  )
}

export default ChartContainer
