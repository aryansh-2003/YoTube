import React, { useEffect, useState } from 'react'
import VideoCard from '../components/video/VideoCard'
import videoService from '../../Service/video'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';



export default function History() {

  const [videos,setvideos] = useState()
  const userData = useSelector(state => state.auth.userData)
  
  useEffect(()=>{
    if(!userData) return
    Promise.all(
      userData?.watchHistory.map((id)=>{
        return videoService.getSingleVideo({id:id})
      })
  ) .then((response)=>{
    const allvideos = response.map((res) => res?.data?.data)
    setvideos(allvideos)
  }) 
  },[userData])



  return (
    <main className="flex-1 h-full">
      <div className="p-6">
        {/* Category tabs */}
       <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide scroll-smooth">
        
      </div>
             <VideoCard loading={false}  data={videos}/>
        </div>
    </main>
    
  );
};
