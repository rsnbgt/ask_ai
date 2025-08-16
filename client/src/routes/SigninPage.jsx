import { SignIn } from '@clerk/clerk-react'
import React from 'react'

const SigninPage = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <SignIn path="/sign-in" signUpUrl='/sign-up' forceRedirectUrl="/daashboard"/>
    </div>
  )
}

export default SigninPage