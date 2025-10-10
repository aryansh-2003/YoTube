import React, { useContext, useEffect, useState } from 'react'
import VideoCard from '../components/video/VideoCard'
import videoService from '../../Service/video'
import HeaderContext from "../components/context/HeaderContext";

export default function Home() {
  const categories = [
    'All', 'Music', 'GATE Exam', 'Mixes', 'News', 
    'Movie musicals', 'Podcasts', 'Computer programming', 
    'Indian classical music', 'Goddesses', 'Mantras', 'Indian'
  ];
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
        {/* Category tabs */}
       <div className="flex gap-3 mb-6 overflow-x-auto scrollbar-hide scroll-smooth">
        {categories.map((category, index) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
              index === 0 
                ? 'bg-white text-black' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
                <VideoCard loading={false} data={videos ? videos?.data?.data : null}/>
        </div>
    </main>
    
  );
};
