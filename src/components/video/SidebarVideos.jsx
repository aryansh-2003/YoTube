import { useEffect, useState } from 'react';
import {timeAgo,formatVideoDuration} from '../TimeResolver.js';  
import videoService from '../../../Service/video'
import { useNavigate } from 'react-router';

export default function SidebarVideos({ query, onVideoClick }){

  const [videos,setvideos] = useState()
  const navigate = useNavigate()
  
  useEffect(() => {
    if(!query) return
    videoService.getAllVideos({query: query.split("-")?.[0]}).then((res) => {
      if(res.status === 200 || 201){
        setvideos(res?.data?.data)
      }
    })
  },[query])
  return (
    <div className="space-y-3">
          {videos 
      ? videos.length === 0 
        ? <><h1>No videos uploaded</h1></> 
        : <>
        
      {videos?.map((video) => (
        <div 
          key={video._id} 
          onClick={() => navigate(`/video/${video._id}`)}
          className="flex space-x-3 cursor-pointer hover:bg-gray-800/30 p-2 rounded-lg transition-all duration-200 group"
        >
          <div className="relative flex-shrink-0">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-32 h-20 sm:w-40 sm:h-24 object-cover rounded-lg group-hover:rounded-xl transition-all duration-200"
            />
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {video ? `${formatVideoDuration(video.duration)}` : "0"}
            </span>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-white text-sm font-medium line-clamp-2 leading-tight group-hover:text-gray-200 transition-colors">
              {video.title}
            </h4>
            <h4 className="text-white text-sm font-medium line-clamp-2 leading-tight group-hover:text-gray-200 transition-colors">
              {video.description}
            </h4>
            <p className="text-gray-400 text-xs hover:text-gray-300 transition-colors">
              {video ? video?.ownerInfo?.[0]?.username : ""}
            </p>
            <div className="text-gray-400 text-xs space-x-1">
              <span>views : {video.views}</span>
              <span>•</span>
              <span>{video ? `${timeAgo(video.createdAt)}` : "0"}</span>
            </div>
          </div>
        </div>
      ))}
        </>
      : <>
      <h1>...Loading</h1>
      </>}

    </div>
  );
};