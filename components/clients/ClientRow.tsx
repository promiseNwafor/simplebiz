import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pages } from '@/routes'

import { deleteClient, editClient } from '@/actions/clients'
import { ClientProps } from '@/types'
import { ClientSchemaValues } from '@/schemas'
import Modal from '../reusables/Modal'
import ClientForm from './ClientForm'
import DeleteClientContainer from './DeleteClientContainer'
import ActionsDropdown from '../reusables/ActionsDropdown'

export enum MenuActions {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
}

export type ActionMenuProps = {
  [key: string]: {
    onClick: () => void
    Content?: JSX.Element
    title?: string
  }
}

type ClientRowProps = {
  client: ClientProps
}

const ClientRow: React.FC<ClientRowProps> = ({ client }) => {
  const [modalAction, setModalAction] = useState<MenuActions | null>(null)
  const router = useRouter()

  const { id, name, email, phone, billingAddress, invoiceCount, serialNumber } =
    client

  const editClientHandler = async (values: ClientSchemaValues) => {
    await editClient(id, values)
  }

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
      Content: (
        <ClientForm
          client={client}
          submitHandler={editClientHandler}
          toggleModal={() => setModalAction(null)}
        />
      ),
      title: 'Edit client',
    },
    [MenuActions.DELETE]: {
      onClick: () => {
        setModalAction(MenuActions.DELETE)
      },
      Content: <DeleteClientContainer deleteHandler={() => deleteClient(id)} />,
      title: 'Delete client?',
    },
  }

  return (
    <div className='grid grid-cols-12 text-xs font-medium p-4 border-b border-gray-200 items-center'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      <div>{serialNumber}</div>
      <div className='col-span-2 truncate max-w-44'>{name}</div>
      <div className='col-span-2 truncate max-w-max-w-44'>{email}</div>
      <div className='col-span-2 truncate max-w-max-w-44'>{phone}</div>
      <div>{invoiceCount}</div>
      <div className='col-span-3 truncate max-w-64'>{billingAddress}</div>
      <div className='flex justify-end'>
        <ActionsDropdown menuItems={actionMenus} />
      </div>
    </div>
  )
}

export default ClientRow
