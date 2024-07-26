'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileSettingsContainer from './ProfileSettingsContainer'

const SettingsContainer = () => {
  return (
    <div className='space-y-8 bg-white rounded-lg min-h-screen p-6'>
      <Tabs defaultValue='profile'>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='notification'>Notification</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <ProfileSettingsContainer />
        </TabsContent>
        <TabsContent value='notification'>
          Change your notification here.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsContainer
