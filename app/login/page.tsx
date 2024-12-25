import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6">
        <SignIn />
      </div>
    </div>
  )
}

export default page
