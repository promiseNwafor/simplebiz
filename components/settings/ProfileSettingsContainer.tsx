import { SquarePen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BeatLoader } from 'react-spinners'
import { useGetBusiness, useGetCurrentUser } from '@/store/useUserData'
import { businessDetailsTitles, userDetailsTitles } from '@/constants'
import ActionIcon from '@/components/reusables/ActionIcons'
import { useState } from 'react'
import Modal from '../reusables/Modal'

enum ProfileModalScreen {
  USER = 'user',
  BUSINESS = 'business',
  INITIAL = 'initial',
}

const ProfileSettingsContainer = () => {
  const [modalScreen, setModalScreen] = useState(ProfileModalScreen.INITIAL)

  const toggleModal = (screen = ProfileModalScreen.INITIAL) =>
    setModalScreen(screen)

  const { data: userData, isPending: userIsPending } =
    useQuery(useGetCurrentUser())
  const { data: businessData } = useQuery(useGetBusiness())

  const user = userData?.user
  const business = businessData?.data

  const userLoading = userIsPending || !user

  const modalComponent = () => {
    switch (modalScreen) {
      case ProfileModalScreen.USER:
        return <div>User</div>
      case ProfileModalScreen.BUSINESS:
        return <div>Business</div>
      default:
        return
    }
  }

  return (
    <>
      <Modal
        open={modalScreen && modalScreen !== ProfileModalScreen.INITIAL}
        onClose={toggleModal}
        content={modalComponent()}
        title='Edit'
      />
      {userLoading ? (
        <BeatLoader color='#008678' className='text-center mt-6' />
      ) : (
        <div className='space-y-3 py-5'>
          <p className='text-2xl font-semibold'>General</p>
          <hr />
          <div className='md:w-[650px] space-y-5'>
            <div className='space-y-2.5'>
              <div className='flex justify-between items-center'>
                <p className='text-lg font-medium'>User details</p>
                <ActionIcon
                  icon={<SquarePen />}
                  label='Edit'
                  onClick={() => toggleModal(ProfileModalScreen.USER)}
                />
              </div>

              {userDetailsTitles.map((title) => (
                <div key={title.name} className='flex items-center gap-2 py-1'>
                  <p className='text-sm font-medium opacity-45 w-40 text-right'>
                    {`${title.label} - `}
                  </p>
                  <p className='text-sm'>{user[title.name]}</p>
                </div>
              ))}
            </div>
            {business && !userLoading && (
              <div className='space-y-2.5'>
                <div className='flex justify-between items-center'>
                  <p className='text-lg font-medium'>Business details</p>
                  <ActionIcon
                    icon={<SquarePen />}
                    label='Edit'
                    onClick={() => toggleModal(ProfileModalScreen.BUSINESS)}
                  />
                </div>

                {businessDetailsTitles.map((title) => (
                  <div
                    key={title.name}
                    className='flex items-center gap-2 py-1'
                  >
                    <p className='text-sm font-medium opacity-45 w-40 text-right'>
                      {`${title.label} - `}
                    </p>
                    <p className='text-sm'>{(business as any)[title.name]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileSettingsContainer
