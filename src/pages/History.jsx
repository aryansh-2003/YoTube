import React, { useEffect, useState } from 'react'
import VideoCard from '../components/video/VideoCard'
import authService from '../../Service/auth'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';



export default function History() {

  const [videos,setvideos] = useState()
  const userData = useSelector(state => state.auth.userData)
  
  useEffect(()=>{
      authService.getUserHistory().then((res) => {
        if(res.status === 200 || 201){
          setvideos(res?.data?.data)
        }
      })
  },[userData])



  return (
    <main className="flex-1 h-full">
      <div className="p-6">
        {/* Category tabs */}
       <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide scroll-smooth">
        
      </div>
             <VideoCard  data={videos}/>
        </div>
    </main>
    
  );
};
