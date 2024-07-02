import { Ellipsis } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import capitalize from 'lodash/capitalize'
import { ActionMenuProps } from '@/components/clients/ClientRow'

type ActionsDropdownProps = {
  menuItems: ActionMenuProps
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ menuItems }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center justify-between outline-none'>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <>
          {Object.keys(menuItems).map((key) => (
            <DropdownMenuItem key={key} onClick={menuItems[key].onClick}>
              {capitalize(key)}
            </DropdownMenuItem>
          ))}
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionsDropdown
