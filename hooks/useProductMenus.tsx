import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pages } from '@/routes'

import { deleteProduct, editProduct } from '@/actions/products'
import { ProductSchemaValues } from '@/schemas'
import { ActionMenuProps, Product } from '@/types'
import DeleteActionContainer from '@/components/reusables/DeleteActionContainer'
import ProductForm from '@/components/catalogue/ProductForm'

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

  const editProductHandler = async (values: ProductSchemaValues) => {
    const response = await editProduct(product.id, values)

    return response
  }

  const deleteProductHandler = async () => {
    const response = await deleteProduct(product.id)
    //TODO: Delete product image from vercel blob storage

    return response
  }

  const actionMenus: ActionMenuProps = {
    [ProductMenuActions.VIEW]: {
      onClick: () => {
        router.push(`${Pages.CATALOGUE}/${product.id}`)
      },
    },
    [ProductMenuActions.EDIT]: {
      onClick: () => {
        setModalAction(ProductMenuActions.EDIT)
      },
      Content: (
        <ProductForm
          toggleModal={() => setModalAction(null)}
          submitHandler={editProductHandler}
          product={product}
        />
      ),
      title: 'Edit client',
    },
    [ProductMenuActions.DELETE]: {
      onClick: () => {
        setModalAction(ProductMenuActions.DELETE)
      },
      Content: (
        <DeleteActionContainer
          deleteHandler={deleteProductHandler}
          toggleModal={() => setModalAction(null)}
          statement='Are you sure you want to delete this product? This action
            cannot be reversed.'
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
