import { useState } from 'react'
import { Ellipsis } from 'lucide-react'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/navigation'
import { Pages } from '@/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Modal from '../Modal'
import AddClientForm from './AddClientForm'
import { Client } from '@prisma/client'
import { addClient } from '@/store/clients'

enum MenuActions {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
}

type ClientRowProps = {
  client: Client
  index: number
}

type ActionMenuProps = {
  [key: string]: {
    onClick: () => void
    Content?: JSX.Element
    title?: string
  }
}

const ClientRow: React.FC<ClientRowProps> = ({ client, index }) => {
  const [modalAction, setModalAction] = useState<MenuActions | null>(null)
  const router = useRouter()

  const { id, name, email, phone, billingAddress } = client

  const actionMenus: ActionMenuProps = {
    [MenuActions.VIEW]: {
      onClick: () => {
        router.push(`${Pages.CLIENTS}/${id}`)
      },
    },
    [MenuActions.EDIT]: {
      onClick: () => {
        setModalAction(MenuActions.EDIT)
      },
      Content: <AddClientForm client={client} submitHandler={addClient} />,
      title: 'Edit client',
    },
    [MenuActions.DELETE]: {
      onClick: () => {
        setModalAction(MenuActions.DELETE)
      },
      Content: <div>Delete</div>, // TODO: Add delete modal
      title: 'Delete client',
    },
  }

  return (
    <div className='grid grid-cols-12 text-xs font-medium p-4 border-b border-gray-200'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      <div>{index + 1}</div>
      <div className='col-span-2 truncate max-w-44'>{name}</div>
      <div className='col-span-2 truncate max-w-max-w-44'>{email}</div>
      <div className='col-span-2 truncate max-w-max-w-44'>{phone}</div>
      <div>{0}</div>
      <div className='col-span-3 truncate max-w-64'>{billingAddress}</div>
      <div className='flex justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center justify-between outline-none'>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <>
              {Object.keys(actionMenus).map((key) => (
                <DropdownMenuItem key={key} onClick={actionMenus[key].onClick}>
                  {capitalize(key)}
                </DropdownMenuItem>
              ))}
            </>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default ClientRow
