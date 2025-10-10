import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import authService from '../../Service/auth'
import { SpinnerDotted } from 'spinners-react';
import { useNavigate } from 'react-router';
import { login } from '../Store/authSlice';

function PrivateRoute({children}) {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading,setloading] = useState("false")
  const userData = useSelector(state=>state.auth.userData)

  
  
  useEffect(()=>{
    if(!userData){
    setloading("loading")
    authService.getCurrentUser().then((userData)=>{
      if(userData === null) {navigate('/')}
      dispatch(login(userData?.data?.data))
      setloading("false")
    }).catch((error)=>{console.log(error)})
  }
  },[userData,navigate])

  if(loading == "loading"){
      return (
    <div className='w-full h-full flex justify-center items-center absolute bg-black  z-1'>
        <SpinnerDotted/>
    </div>
  
  )
  }else if(loading == "false"){
    return children
  }


  // return children
}

export default PrivateRoute