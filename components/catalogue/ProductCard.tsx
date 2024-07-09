import Image from 'next/image'
import capitalize from 'lodash/capitalize'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import { ngnFormatter } from '@/lib'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import useProductMenus from '@/hooks/useProductMenus'
import Modal from '@/components/reusables/Modal'
import ActionsDropdown from '@/components/reusables/ActionsDropdown'

type ProductCardProps = {
  product: Product
}

const bgColor = {
  physical: 'bg-[#FFF6DA]',
  service: 'bg-primary-light',
  digital: 'bg-[#FDE3E1]',
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { modalAction, setModalAction, actionMenus } = useProductMenus(product)

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
        <div className='centered h-28'>
          {product.imageURL ? (
            <Image
              src={product.imageURL}
              width={120}
              height={70}
              alt={product.name}
            />
          ) : (
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
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Switch checked={product.available} />
          <Badge variant='outline' className='text-gray-500'>
            {capitalize(product.type)}
          </Badge>
        </div>
        <p className='font-semibold max-w-[46%] break-all'>
          {ngnFormatter.format(product.price)}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
