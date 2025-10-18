import React, { useContext, useEffect, useState } from 'react'
import VideoCard from '../components/video/VideoCard'
import likeService from '../../Service/like'

export default function LikedVideos() {



  const [videos,setvideos] = useState()

  

  useEffect(()=>{
        likeService.getLikedVideos().then((res)=>{
               console.log(res)
               if(res.status === 200 || 201){
                setvideos(res)
                console.log(res)
               }
        })
  },[])



  return (
    <main className={`flex-1 bg-black  pt-2 min-h-screen text-white`}>
      <div className="pt-5">
                <VideoCard loading={false} data={videos ? videos?.data?.data : null}/>
                
        </div>
    </main>
    
  );
};
