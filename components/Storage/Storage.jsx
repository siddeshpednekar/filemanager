import React from 'react'
import UserInfo from './UserInfo'
import StorageInfo from './StorageInfo'
import StorageDetailList from './StorageDetailList'
import { useUser } from '@clerk/nextjs'
// import StorageUpgradeMsg from './StorageUpgradeMsg'
// import { useSession } from 'next-auth/react'

function Storage() {
    const {data:session}=useUser();
  return (
    <div>
        <UserInfo/>
        <StorageInfo/>
        <StorageDetailList/>
        {/* <StorageUpgradeMsg/> */}
    </div>
  )
}

export default Storage