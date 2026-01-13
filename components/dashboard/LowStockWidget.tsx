'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Package } from 'lucide-react'
import { BeatLoader } from 'react-spinners'
import { useGetLowStockProducts } from '@/store/useStoreData'
import { Pages } from '@/routes'
import GoToButton from '@/components/reusables/GoToButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function LowStockWidget() {
  const router = useRouter()
  const { data, isPending, error } = useQuery(useGetLowStockProducts())

  const lowStockProducts = data?.data?.data || []
  const count = lowStockProducts.length

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Low Stock Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center py-4'>
            <BeatLoader color='#008678' size={8} />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return null // Don't show widget if there's an error
  }

  if (count === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Low Stock Alert
          </CardTitle>
          <CardDescription>All products are well stocked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center py-4'>
            <p className='text-muted-foreground text-sm'>No low stock items</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border-orange-200 bg-orange-50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-orange-700'>
          <AlertTriangle className='h-5 w-5' />
          Low Stock Alert
        </CardTitle>
        <CardDescription>
          {count} product{count !== 1 ? 's' : ''} need{count === 1 ? 's' : ''}{' '}
          restocking
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2 max-h-[200px] overflow-y-auto'>
          {lowStockProducts.slice(0, 5).map((product: any) => {
            const threshold = product.lowStockThreshold ?? 10
            const isCritical = product.quantity === 0
            return (
              <div
                key={product.id}
                className='flex items-center justify-between p-2 bg-white rounded border border-orange-200'
              >
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{product.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    Stock: {product.quantity} / Threshold: {threshold}
                  </p>
                </div>
                <Badge
                  variant={isCritical ? 'destructive' : 'outline'}
                  className='ml-2'
                >
                  {isCritical ? 'Out of Stock' : 'Low Stock'}
                </Badge>
              </div>
            )
          })}
          {lowStockProducts.length > 5 && (
            <p className='text-xs text-muted-foreground text-center pt-2'>
              +{lowStockProducts.length - 5} more product(s)
            </p>
          )}
        </div>
        <GoToButton
          onClick={() => {
            router.push(Pages.CATALOGUE)
          }}
        >
          View All Products
        </GoToButton>
      </CardContent>
    </Card>
  )
}
