import React, { useContext, useEffect, useState } from 'react'
import VideoCard from '../components/video/VideoCard'
import videoService from '../../Service/video'
import HeaderContext from "../components/context/HeaderContext";
import PlaylistOverlay from '../components/PlaylistOverlay';

export default function Home() {



  const [videos,setvideos] = useState()
  const { sidebarOpen } = useContext(HeaderContext);

  

  useEffect(()=>{
        videoService.getHomeVids().then((res)=>{
                if(!res) return 
                setvideos(res)
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
