import React from 'react'
import authService from '../../Service/auth.js'
import SignUpComponent from '../components/signUpForm/SignUpComponent.jsx'

function SignUp() {
  return (
    <div className='w-full h-full absolute z-2000 top-0'><SignUpComponent/></div>
  )
}

export default SignUp