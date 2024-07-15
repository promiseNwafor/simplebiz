import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@prisma/client'
import { Pages } from '@/routes'

import { ActionMenuProps, ClientProps } from '@/types'
import { ClientSchemaValues } from '@/schemas'
import { editClient, deleteClient } from '@/actions/clients'
import ClientForm from '@/components/clients/ClientForm'
import DeleteActionContainer from '@/components/reusables/DeleteActionContainer'

export enum InvoiceMenuActions {
  VIEW = 'view',
  DOWNLOAD = 'download',
  ARCHIVE = 'archive',
}

const useInvoiceMenus = (client: ClientProps | Client) => {
  const [modalAction, setModalAction] = useState<InvoiceMenuActions | null>(
    null
  )
  const router = useRouter()

  const editClientHandler = async (values: ClientSchemaValues) => {
    const response = await editClient(client.id, values)

    return response
  }

  const actionMenus: ActionMenuProps = {
    [InvoiceMenuActions.VIEW]: {
      onClick: () => {
        router.push(`${Pages.CLIENTS}/${client.id}`)
      },
    },
    [InvoiceMenuActions.DOWNLOAD]: {
      onClick: () => {
        setModalAction(InvoiceMenuActions.DOWNLOAD)
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
    [InvoiceMenuActions.ARCHIVE]: {
      onClick: () => {
        setModalAction(InvoiceMenuActions.ARCHIVE)
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

export default useInvoiceMenus
