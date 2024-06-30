import { Plus } from 'lucide-react'
import { Button } from './ui/button'

type AddButtonProps = {
  children: string
}

const AddButton: React.FC<AddButtonProps> = ({ children }) => {
  return (
    <Button className='py-6 rounded-lg font-medium'>
      <Plus className='mr-1 h-4 w-4' /> {children}
    </Button>
  )
}

export default AddButton
