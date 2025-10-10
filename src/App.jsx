import React, { useEffect, useState } from 'react'
import Layout  from './layout/Layout'
import authService from '../Service/auth'
import { useNavigate } from 'react-router';
import { login } from './Store/authSlice';
import {useDispatch, useSelector} from 'react-redux'




export default function App() {

  const userData = useSelector(state => state.auth.userData)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [AuthStatus,setAuthStatus] = useState(false)


  useEffect(()=>{
    if(!userData){
    authService.getCurrentUser().then((userData)=>{
      if(userData == null && !location.pathname === '/signup') navigate('/')
      dispatch(login(userData?.data?.data))
    if(location.pathname === '/'){
      navigate('/home')
    }
    }).catch((error)=>{console.log(error)})
  }
  },[])


  return (
    <Layout AuthStatus={AuthStatus}/>
  )
}