import React, { useEffect, useState } from 'react'
import Layout  from './layout/Layout'
import authService from '../Service/auth'
import { useNavigate } from 'react-router';
import { login } from './Store/authSlice';
import {useDispatch, useSelector} from 'react-redux'
import { ReactLenis, useLenis } from 'lenis/react'
import { SpeedInsights } from '@vercel/speed-insights/react';
import SplashScreen from './assets/kling_20251122_Image_to_Video_This_logo__3264_0.gif'
import Loader from './PreLoader/loader'
import ShinyText from "./components/BlurText/BlurText";





export default function App() {

  const userData = useSelector(state => state.auth.userData)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [AuthStatus,setAuthStatus] = useState(false)
  const [loading,setloading] = useState(true)

  

  useEffect(()=>{
    setloading(true)
    setTimeout(() => {
      setloading(false)
    }, 5000);
    if(!userData){
    authService.getCurrentUser().then((userData)=>{
      if(userData == null || undefined && !location.pathname === '/signup'){ 
        navigate('/')
      }
      dispatch(login(userData?.data?.data)) 
    if(location.pathname === '/'){
      navigate('/home')
    }
    }).catch((error)=>{
      console.log(error)
      
    })
  }
  },[])


if (loading) {
  return( 
  <>
    <div className='h-screen flex justify-center items-center flex-col space-y-5'>
      <Loader/>
      <ShinyText
      className='md:text-2xl'
      text="✨ Serving you best..."
      speed={3}
      delay={1}
      color="#b5b5b5"
      shineColor="#ffffff"
      spread={140}
      direction="left"
      yoyo={true}
      pauseOnHover={false}
    />
    </div>
    </>
  )
}

return (
  <>
    <ReactLenis root />
    <SpeedInsights />
    <Layout AuthStatus={AuthStatus} />
  </>
);

}
