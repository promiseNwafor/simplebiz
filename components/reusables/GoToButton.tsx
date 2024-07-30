import { MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type GoToButtonProps = {
  children: string
  onClick?: () => void
}

const GoToButton: React.FC<GoToButtonProps> = ({ children, onClick }) => {
  return (
    <Button
      variant='link'
      className='py-6 rounded-lg font-medium p-0 centered gap-2'
      onClick={onClick}
    >
      {children}
      <MoveRight className='mr-1 h-4 w-4' />
    </Button>
  )
}

export default GoToButton
