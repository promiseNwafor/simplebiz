import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@prisma/client'
import { Pages } from '@/routes'

import { ActionMenuProps, ClientProps } from '@/types'
import { ClientSchemaValues } from '@/schemas'
import { editClient, deleteClient } from '@/actions/clients'
import ClientForm from '@/components/clients/ClientForm'
import DeleteClientContainer from '@/components/clients/DeleteClientContainer'

export enum ClientMenuActions {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
}

const useClientMenus = (client: ClientProps | Client) => {
  const [modalAction, setModalAction] = useState<ClientMenuActions | null>(null)
  const router = useRouter()

  const editClientHandler = async (values: ClientSchemaValues) => {
    const response = await editClient(client.id, values)

    return response
  }

  const actionMenus: ActionMenuProps = {
    [ClientMenuActions.VIEW]: {
      onClick: () => {
        router.push(`${Pages.CLIENTS}/${client.id}`)
      },
    },
    [ClientMenuActions.EDIT]: {
      onClick: () => {
        setModalAction(ClientMenuActions.EDIT)
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
    [ClientMenuActions.DELETE]: {
      onClick: () => {
        setModalAction(ClientMenuActions.DELETE)
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

export default useClientMenus
