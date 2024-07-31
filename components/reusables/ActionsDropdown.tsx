import { Ellipsis } from 'lucide-react'
import capitalize from 'lodash/capitalize'
import { ActionMenuProps } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ActionsDropdownProps = {
  menuItems: ActionMenuProps
  icon?: JSX.Element
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  menuItems,
  icon,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center justify-between outline-none'>
        {icon ? icon : <Ellipsis />}
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
