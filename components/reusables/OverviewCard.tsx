import { cn } from '@/lib/utils'

type OverviewCardProps = {
  label: string
  title: string
  className?: string
  labelClassName?: string
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  label,
  title,
  className,
  labelClassName,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col justify-evenly p-4 pl-10 bg-white rounded-lg h-36',
        className
      )}
    >
      <p
        className={cn(
          'text-light-grey text-xs tracking-tighter font-medium',
          labelClassName
        )}
      >
        {label}
      </p>
      <p className='font-semibold text-3xl'>{title}</p>
    </div>
  )
}

export default OverviewCard
