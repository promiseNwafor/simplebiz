'use client'

import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import { trendData } from '@/constants'
import { Button } from '../ui/button'

const ChartContainer = () => {
  return (
    <div className='lg:col-span-2 bg-white p-6 rounded-lg overflow-x-auto'>
      <div>
        <p className='font-semibold'>
          Sales Trend
          <Button variant='link'>Annual</Button>
        </p>
      </div>
      <div className='h-[334px] min-w-[567px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={trendData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#19C98A' stopOpacity={0.9} />
                <stop offset='95%' stopColor='#19C98A' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey='name' />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='uv'
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
