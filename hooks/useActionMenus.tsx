import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@prisma/client'
import { Pages } from '@/routes'

import { ClientProps } from '@/types'
import { ClientSchemaValues } from '@/schemas'
import { editClient, deleteClient } from '@/actions/clients'
import ClientForm from '@/components/clients/ClientForm'
import DeleteClientContainer from '@/components/clients/DeleteClientContainer'

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

const useActionMenus = (client: ClientProps | Client) => {
  const [modalAction, setModalAction] = useState<MenuActions | null>(null)
  const router = useRouter()

  const editClientHandler = async (values: ClientSchemaValues) => {
    const response = await editClient(client.id, values)

    return response
  }

  const actionMenus: ActionMenuProps = {
    [MenuActions.VIEW]: {
      onClick: () => {
        router.push(`${Pages.CLIENTS}/${client.id}`)
      },
    },
    [MenuActions.EDIT]: {
      onClick: () => {
        setModalAction(MenuActions.EDIT)
      },
      Content: (
        <ClientForm
          client={client as ClientProps}
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
      Content: (
        <DeleteClientContainer
          deleteHandler={async () => await deleteClient(client.id)}
          toggleModal={() => setModalAction(null)}
        />
      ),
      title: 'Delete client?',
    },
  }

  return {
    modalAction,
    setModalAction,
    actionMenus,
  }
}

export default useActionMenus
