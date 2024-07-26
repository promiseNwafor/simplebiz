import { useState } from 'react'
import { Payment } from '@prisma/client'

import { ActionMenuProps } from '@/types'

export enum PaymentMenuActions {
  DOWNLOAD = 'download',
  ARCHIVE = 'archive',
}

const usePaymentMenu = (payment: Payment) => {
  const [modalAction, setModalAction] = useState<PaymentMenuActions | null>(
    null
  )

  const actionMenus: ActionMenuProps = {
    [PaymentMenuActions.DOWNLOAD]: {
      onClick: () => {
        setModalAction(PaymentMenuActions.DOWNLOAD)
      },
      Content: <div>Download</div>,
      title: 'Download Payment',
    },
    [PaymentMenuActions.ARCHIVE]: {
      onClick: () => {
        setModalAction(PaymentMenuActions.ARCHIVE)
      },
      Content: <div>Archive</div>,
      title: 'Delete client?',
    },
  }

  return {
    modalAction,
    setModalAction,
    actionMenus,
  }
}

export default usePaymentMenu
