'use client'

import { SquarePen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BeatLoader } from 'react-spinners'
import { useGetBusiness, useGetCurrentUser } from '@/store/useUserData'
import { businessDetailsTitles, userDetailsTitles } from '@/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ActionIcon from '@/components/reusables/ActionIcons'

const SettingsContainer = () => {
  const { data: userData, isPending: userIsPending } =
    useQuery(useGetCurrentUser())
  const { data: businessData, isPending: businessIsPending } =
    useQuery(useGetBusiness())

  const user = userData?.user
  const business = businessData?.data

  const businessLoading = businessIsPending || !business
  const userLoading = userIsPending || !user

  return (
    <div className='space-y-8 bg-white rounded-lg min-h-screen p-6'>
      <Tabs defaultValue='profile'>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='notification'>Notification</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          {userLoading || businessLoading ? (
            <BeatLoader color='#008678' className='text-center mt-6' />
          ) : (
            <div className='space-y-3 py-5'>
              <p className='text-2xl font-semibold'>General</p>
              <hr />
              <div className='md:w-[650px] space-y-5'>
                <div className='space-y-2.5'>
                  <div className='flex justify-between items-center'>
                    <p className='text-lg font-medium'>User details</p>
                    <ActionIcon icon={<SquarePen />} label='Edit' />
                  </div>

                  {userDetailsTitles.map((title) => (
                    <div
                      key={title.name}
                      className='flex items-center gap-2 py-1'
                    >
                      <p className='text-sm font-medium opacity-45 w-40 text-right'>
                        {`${title.label} - `}
                      </p>
                      <p className='text-sm'>{user[title.name]}</p>
                    </div>
                  ))}
                </div>
                <div className='space-y-2.5'>
                  <div className='flex justify-between items-center'>
                    <p className='text-lg font-medium'>Business details</p>
                    <ActionIcon icon={<SquarePen />} label='Edit' />
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
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value='notification'>
          Change your notification here.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsContainer
