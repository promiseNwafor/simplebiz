import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pages } from '@/routes'

import { ActionMenuProps, ClientProps } from '@/types'
import { ClientSchemaValues } from '@/schemas'
import { useDeleteClient, useEditClient } from '@/store/useStoreData'
import { GetClientDetailsReturn } from '@/store/clients'
import ClientForm from '@/components/clients/ClientForm'
import DeleteActionContainer from '@/components/reusables/DeleteActionContainer'

export enum ClientMenuActions {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
}

const useClientMenus = (client: ClientProps | GetClientDetailsReturn) => {
  const [modalAction, setModalAction] = useState<ClientMenuActions | null>(null)
  const router = useRouter()

  const { mutateAsync: editClient } = useEditClient()
  const { mutateAsync: deleteClient } = useDeleteClient()

  const editClientHandler = async (values: ClientSchemaValues) => {
    const response = await editClient({ id: client.id, values })

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
        <DeleteActionContainer
          deleteHandler={async () => await deleteClient(client.id)}
          toggleModal={() => setModalAction(null)}
          statement='Are you sure you want to delete this client? This action cannot be
        reversed and all related info including invoices and payment history
        will be lost.'
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
