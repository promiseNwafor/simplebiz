import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { PaymentDetail } from '@prisma/client'
import { useGetPaymentDetails, useGetWalletDetails } from '@/store/useStoreData'
import { ngnFormatter } from '@/lib'
import { Button } from '@/components/ui/button'
import Modal from '@/components/reusables/Modal'
import PaymentAccount from './PaymentAccount'
import PaymentWithdrawal from './PaymentWithdrawal'

const accountInfoTitles: { [key: string]: string } = {
  bankName: 'Bank',
  accountNumber: 'Account number',
  accountName: 'Account name',
}

export enum ModalScreen {
  DETAILS = 'details',
  WITHDRAWAL = 'withdrawal',
  INITIAL = 'initial',
}

export const displayDetails = (accountDetails: PaymentDetail) => {
  return (
    <div className='flex justify-between'>
      {Object.keys(accountInfoTitles).map((key) => (
        <div key={key}>
          <small className='opacity-50'>{accountInfoTitles[key]}</small>
          <p>{(accountDetails as any)[key]}</p>
        </div>
      ))}
    </div>
  )
}

const PaymentDetails = () => {
  const [modalScreen, setModalScreen] = useState(ModalScreen.INITIAL)

  const { data: walletData } = useQuery(useGetWalletDetails())
  const { data: paymentDetailsData } = useQuery(useGetPaymentDetails())

  const toggleModal = (screen = ModalScreen.INITIAL) => setModalScreen(screen)

  const wallet = walletData?.data?.data
  const accountDetails = paymentDetailsData?.data?.data

  const modalComponent = () => {
    switch (modalScreen) {
      case ModalScreen.DETAILS:
        return (
          <PaymentAccount
            toggleModal={toggleModal}
            accountDetails={accountDetails}
          />
        )
      case ModalScreen.WITHDRAWAL:
        return (
          <PaymentWithdrawal
            toggleModal={toggleModal}
            balance={wallet?.balance || 0}
            accountDetails={accountDetails}
          />
        )
      default:
        return
    }
  }

  return (
    <div>
      <Modal
        open={modalScreen && modalScreen !== ModalScreen.INITIAL}
        onClose={toggleModal}
        content={modalComponent()}
        title={
          modalScreen === ModalScreen.WITHDRAWAL ? 'Withdrawal' : 'Bank Info'
        }
      />
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='bg-primary text-white flex flex-col justify-between rounded-lg p-5 h-52'>
          <p className='font-medium'>Wallet balance</p>
          <p className='text-3xl font-semibold'>
            {ngnFormatter.format(wallet?.balance || 0)}
          </p>
          <Button
            size='full'
            className='bg-white text-primary hover:bg-white hover:opacity-90'
            onClick={() => setModalScreen(ModalScreen.WITHDRAWAL)}
          >
            Withdraw
          </Button>
        </div>
        <div className='bg-white flex flex-col justify-between rounded-lg p-5 h-52'>
          <p className='font-medium'>Account information</p>
          {accountDetails ? (
            <>{displayDetails(accountDetails)}</>
          ) : (
            <div className='centered opacity-50 text-sm'>
              Account information not added yet
            </div>
          )}
          <Button
            size='full'
            variant='outline'
            className='border-primary text-primary hover:text-primary hover:opacity-90'
            onClick={() => setModalScreen(ModalScreen.DETAILS)}
          >
            {accountDetails ? 'Edit Details' : 'Add Details'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentDetails
