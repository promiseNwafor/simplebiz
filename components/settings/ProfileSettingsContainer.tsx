import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SquarePen } from 'lucide-react'
import pick from 'lodash/pick'
import { toast } from 'sonner'
import { Business, User } from '@prisma/client'

import {
  RegisterFormValues,
  RegisterFormSchema,
  BusinessFormValues,
  UserProfileFormValues,
} from '@/schemas'
import { businessDetailsTitles, userDetailsTitles } from '@/constants'
import { useUpdateBusiness, useUpdateUserProfile } from '@/store/useUserData'
import { Form } from '@/components/ui/form'
import ActionIcon from '@/components/reusables/ActionIcons'
import Modal from '@/components/reusables/Modal'
import UserDetailsContainer from '@/components/auth/UserDetailsContainer'
import BusinessDetailsContainer from '@/components/auth/BusinessDetailsContainer'

enum ProfileModalScreen {
  USER = 'user',
  BUSINESS = 'business',
  INITIAL = 'initial',
}

type ProfileSettingsContainerProps = {
  user: User
  business: Business
}

const ProfileSettingsContainer: React.FC<ProfileSettingsContainerProps> = ({
  user,
  business,
}) => {
  const [modalScreen, setModalScreen] = useState(ProfileModalScreen.INITIAL)

  const { mutateAsync: updateProfile, isPending: userIsPending } =
    useUpdateUserProfile()
  const { mutateAsync: updateBusiness, isPending: businessIsPending } =
    useUpdateBusiness()

  const toggleModal = (screen = ProfileModalScreen.INITIAL) =>
    setModalScreen(screen)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      phoneNumber: user?.phone || undefined,
      address: user?.address || undefined,
      businessName: business?.name || undefined,
      businessAddress: business?.address || undefined,
      rcNumber: business?.registrationNumber || undefined,
      businessDescription: business?.description || undefined,
      industry: business?.industry || undefined,
      password: 'UnderScore123',
      confirmPassword: 'UnderScore123',
      acceptPolicy: true,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
    },
  })

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isDirty },
  } = form

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const keys = [
        'businessName',
        'businessAddress',
        'rcNumber',
        'businessDescription',
        'industry',
      ]
      const businessValues = pick(values, keys) as BusinessFormValues

      const res = await updateBusiness(businessValues)

      if (res.error) {
        return toast.error(res.error)
      }
      toggleModal()
      return toast.success(res.success)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong!')
    }
  }

  const handleUserDetailsSubmit = async () => {
    try {
      const keys = [
        'name',
        'email',
        'address',
        'phoneNumber',
        'isTwoFactorEnabled',
      ]
      const values = pick(getValues(), keys) as UserProfileFormValues

      const res = await updateProfile(values)

      if (res.error) {
        toast.error(res.error)
      }
      toggleModal()
      return toast.success(res.success)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong!')
    }
  }

  const modalComponent = () => {
    switch (modalScreen) {
      case ProfileModalScreen.USER:
        return (
          <UserDetailsContainer
            control={control}
            onSubmit={handleUserDetailsSubmit}
            isRegister={false}
            isPending={userIsPending}
            isDirty={isDirty}
          />
        )
      case ProfileModalScreen.BUSINESS:
        return (
          <BusinessDetailsContainer
            control={control}
            isPending={businessIsPending}
            isRegister={false}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Modal
        open={modalScreen && modalScreen !== ProfileModalScreen.INITIAL}
        onClose={toggleModal}
        content={
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-6'
              autoComplete='off'
            >
              {modalComponent()}
            </form>
          </Form>
        }
        title='Edit'
      />
      <div className='space-y-3 py-5 w-full'>
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
                <p className='text-xs md:text-sm font-medium opacity-45 md:w-40 md:text-right'>
                  {`${title.label} - `}
                </p>
                <p className='text-xs md:text-sm capitalize'>
                  {(user as any)[title.name].toString()}
                </p>
              </div>
            ))}
          </div>
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
              <div key={title.name} className='flex items-center gap-2 py-1'>
                <p className='text-xs md:text-sm font-medium opacity-45 text-nowrap md:w-40 md:text-right'>
                  {`${title.label} - `}
                </p>
                <p className='text-xs md:text-sm'>
                  {(business as any)[title.name]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSettingsContainer
