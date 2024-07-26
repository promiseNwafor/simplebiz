import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type ActionIconProps = {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
}

const ActionIcon: React.FC<ActionIconProps> = ({
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <Button
      variant='ghost'
      size='icon'
      className={cn(
        'text-primary hover:text-primary hover:bg-transparent',
        className
      )}
      onClick={onClick}
    >
      <div className='flex items-center gap-1 ml-2'>
        {icon} {label}
      </div>
    </Button>
  )
}

export default ActionIcon
