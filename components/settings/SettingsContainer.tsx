'use client'

import { BeatLoader } from 'react-spinners'
import { useQuery } from '@tanstack/react-query'
import {
  useGetBusiness,
  useGetCurrentUser,
  useGetRemindersSettings,
} from '@/store/useUserData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileSettingsContainer from './ProfileSettingsContainer'
import NotificationSettingsContainer from './NotificationSettingsContainer'

const SettingsContainer = () => {
  const {
    data: userData,
    isPending: userIsPending,
    error: userError,
  } = useQuery(useGetCurrentUser())
  const { data: businessData, isPending: businessIsPending } =
    useQuery(useGetBusiness())
  const {
    data: remindersData,
    isPending: remindersIsPending,
    error: remindersError,
  } = useQuery(useGetRemindersSettings())

  const user = userData?.user
  const business = businessData?.data
  const reminder = remindersData?.data

  const userIsLoading = userIsPending
  const dataIsError = !user || userError || !business || businessData.error
  const businessIsLoading = businessIsPending
  const remindersIsError = remindersData?.error || remindersError

  return (
    <div className='space-y-6 bg-white rounded-lg min-h-screen p-6 w-full'>
      <Tabs defaultValue='profile' className='w-full'>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='notification'>Notification</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          {userIsLoading || businessIsLoading ? (
            <BeatLoader color='#008678' className='text-center mt-6' />
          ) : (
            <>
              {dataIsError ? (
                <div className='bg-white w-full h-[280px] py-5 centered'>
                  <p>Error fetching data!</p>
                </div>
              ) : (
                <ProfileSettingsContainer user={user} business={business} />
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value='notification'>
          {remindersIsPending ? (
            <BeatLoader color='#008678' className='text-center mt-6' />
          ) : (
            <>
              {remindersIsError ? (
                <div className='bg-white w-full h-[280px] py-5 centered'>
                  <p>{remindersError?.message || 'Error fetching data'}</p>
                </div>
              ) : (
                <NotificationSettingsContainer reminder={reminder} />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsContainer
