import capitalize from 'lodash/capitalize'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import { ngnFormatter } from '@/lib'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import useProductMenus from '@/hooks/useProductMenus'
import Modal from '@/components/reusables/Modal'
import ActionsDropdown from '@/components/reusables/ActionsDropdown'

type ProductCardProps = {
  product: Product
}

export const bgColor = {
  PHYSICAL: 'bg-[#FFF6DA]',
  SERVICE: 'bg-primary-light',
  DIGITAL: 'bg-[#FDE3E1]',
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { modalAction, setModalAction, actionMenus } = useProductMenus(product)

  // Check if product is low in stock
  const threshold = product.lowStockThreshold ?? 10
  const isLowStock = product.quantity <= threshold
  const isOutOfStock = product.quantity === 0

  return (
    <div className='flex flex-col justify-between p-4 bg-white rounded-sm text-sm h-[230px]'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      <div
        className={cn(
          'w-full rounded-sm bg-primary-light',
          bgColor[product.type as keyof typeof bgColor]
        )}
      >
        <div
          className='centered h-28'
          style={
            product.imageURL
              ? {
                  background: `url(${product.imageURL}) no-repeat center center/contain`,
                }
              : {}
          }
          aria-label='product image'
        >
          {!product.imageURL && (
            <p className='text-6xl opacity-65 font-mono'>
              {capitalize(product.name.split('')[0])}
            </p>
          )}
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <p className='w-[88%]'>{product.name}</p>
        <ActionsDropdown menuItems={actionMenus} />
      </div>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Switch checked={product.available} />
            <Badge variant='outline' className='text-gray-500'>
              {capitalize(product.type)}
            </Badge>
            {isLowStock && (
              <Badge
                variant={isOutOfStock ? 'destructive' : 'outline'}
                className='text-xs flex items-center gap-1'
              >
                <AlertTriangle className='h-3 w-3' />
                {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
              </Badge>
            )}
          </div>
          <p className='font-semibold max-w-[46%] break-all'>
            {ngnFormatter.format(product.price)}
          </p>
        </div>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>Stock: {product.quantity}</span>
          {product.lowStockThreshold !== null && (
            <span>Threshold: {product.lowStockThreshold}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
