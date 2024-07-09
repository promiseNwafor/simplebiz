import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Client } from '@prisma/client'
import { Pages } from '@/routes'

import { ActionMenuProps, ClientProps, Product } from '@/types'
import { ClientSchemaValues } from '@/schemas'
import { editClient, deleteClient } from '@/actions/clients'
import ClientForm from '@/components/clients/ClientForm'
import DeleteClientContainer from '@/components/clients/DeleteClientContainer'

export enum ProductMenuActions {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
}

const useProductMenus = (product: Product) => {
  const [modalAction, setModalAction] = useState<ProductMenuActions | null>(
    null
  )
  const router = useRouter()

  const actionMenus: ActionMenuProps = {
    [ProductMenuActions.VIEW]: {
      onClick: () => {
        router.push(`${Pages.CLIENTS}/${product.id}`)
      },
    },
    [ProductMenuActions.EDIT]: {
      onClick: () => {
        setModalAction(ProductMenuActions.EDIT)
      },
      Content: <div>Product</div>,
      title: 'Edit client',
    },
    [ProductMenuActions.DELETE]: {
      onClick: () => {
        setModalAction(ProductMenuActions.DELETE)
      },
      Content: (
        <DeleteClientContainer
          deleteHandler={async () => await deleteClient(product.id)}
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

export default useProductMenus
