import React from 'react'
import {LoginComponent} from '../components/index.js'
import authService from '../../Service/auth.js'

function Login() {
  return (
    <div className='w-full h-full absolute z-2000 top-0'><LoginComponent/></div>
  )
}

export default Login