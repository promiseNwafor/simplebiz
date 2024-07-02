import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AddButtonProps = {
  children: string
  onClick?: () => void
}

const AddButton: React.FC<AddButtonProps> = ({ children, onClick }) => {
  return (
    <Button className='py-6 rounded-lg font-medium' onClick={onClick}>
      <Plus className='mr-1 h-4 w-4' /> {children}
    </Button>
  )
}

export default AddButton
