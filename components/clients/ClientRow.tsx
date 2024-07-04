import { ClientProps } from '@/types'
import useActionMenus from '@/hooks/useActionMenus'
import Modal from '@/components/reusables/Modal'
import ActionsDropdown from '@/components/reusables/ActionsDropdown'

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
  const { modalAction, setModalAction, actionMenus } = useActionMenus(client)

  const { id, name, email, phone, billingAddress, invoiceCount, serialNumber } =
    client

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
