import React from 'react'
import UserSubscribers from '../components/UserSubscribers'
import { useParams } from 'react-router'
import { Vortex } from "../components/ui/vortex"


function UserSubscriberPage() {
  const {userId} = useParams()
  return (
    <div>
          <Vortex
              backgroundColor="black"
              rangeY={800}
              particleCount={50000}
              baseHue={1200}
              className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
            >
      <UserSubscribers channelId={userId}/>
      </Vortex>
      </div>
  )
}

export default UserSubscriberPage