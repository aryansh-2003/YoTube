import React from 'react'
import UserSubscribers from '../components/UserSubscribers'
import { useParams } from 'react-router'

function UserSubscriberPage() {
  const {userId} = useParams()
  return (
    <div><UserSubscribers channelId={userId}/></div>
  )
}

export default UserSubscriberPage