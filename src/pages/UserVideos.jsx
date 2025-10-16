import React, { useEffect, useState } from 'react'
import VideoCard from '../components/video/VideoCard'
import videoService from '../../Service/video'
import dashboardService from '../../Service/dashboard'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import CapybaraLoader from '../components/loader/Capybara'



export default function UserVideos() {

  const [videos,setvideos] = useState()
  const userData = useSelector(state => state.auth.userData)

  console.log(userData)


  useEffect(()=>{
    console.log(userData)
    if(!userData) return
      dashboardService.getChannelVideos(userData._id).then((res)=>{
        console.log(res)
        setvideos(res?.data?.data)
      })
  },[userData])



  return (
    <main className="flex-1 min-h-screen">
      <div className="p-6">
        {/* Category tabs */}
       <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide scroll-smooth">
        
      </div>
             <VideoCard loading={false}  data={videos}/>
        </div>

    </main>

    
  );
};
