import React, { useEffect, useState } from 'react'
import Layout  from './layout/Layout'
import authService from '../Service/auth'
import { useNavigate } from 'react-router';
import { login } from './Store/authSlice';
import {useDispatch, useSelector} from 'react-redux'
import { ReactLenis, useLenis } from 'lenis/react'
import { SpeedInsights } from '@vercel/speed-insights/react';
import SplashScreen from './assets/kling_20251122_Image_to_Video_This_logo__3264_0.gif'






export default function App() {

  const userData = useSelector(state => state.auth.userData)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [AuthStatus,setAuthStatus] = useState(false)
  const [loading,setloading] = useState(true)

  

  useEffect(()=>{
    if(!userData){
    authService.getCurrentUser().then((userData)=>{
      if(userData == null || undefined && !location.pathname === '/signup'){ 
        navigate('/')
      }
      dispatch(login(userData?.data?.data))
      setloading(false) 
    if(location.pathname === '/'){
      navigate('/home')
    }
    }).catch((error)=>{
      console.log(error)
      
    }).finally(() =>{
      setloading(false)
      console.log("hello")
    })
  }
  },[])


if (loading) {
  return <img src={SplashScreen} alt="Loading…" />;
}

return (
  <>
    <ReactLenis root />
    <SpeedInsights />
    <Layout AuthStatus={AuthStatus} />
  </>
);

}
