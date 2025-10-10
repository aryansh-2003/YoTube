import { useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, MoreHorizontal, ThumbsUp, ThumbsDown, Share, Download, Flag, SkipBack, SkipForward, Repeat, Shuffle, Menu, Search, Bell, User, Trash, Pencil, Shell } from 'lucide-react';
import DisplayPic from '../DisplayPic'
import {useSelector} from 'react-redux'
import { useNavigate } from "react-router";
import videoService from '../../../Service/video'


export default function VideoInfo({ videoData }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate()

  const date = new Date(videoData ? videoData?.createdAt : null)
  const userData = useSelector(state => state?.auth?.userData)
  const isAuthor = videoData && userData ? videoData?.ownerInfo?.[0]?._id == userData._id : false
  const [publishStatus,setPublishStatus] = useState()

  useEffect(() => {
    if(!videoData) return
    setPublishStatus(videoData?.isPublished)
  },[videoData])
  
  const publishStatusHandler = () =>{
  
    videoService.changePublishStatus({id:videoData._id,status : !publishStatus}).then((res)=>{
      setPublishStatus(!publishStatus)
    })
  }

  return (
    <div className="bg-transparent text-white space-y-4">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
        {videoData?.title}
      </h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <DisplayPic children={videoData?.ownerInfo?.[0]}/>
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base">{videoData?.ownerInfo?.[0]?.username}</p>
            <p className="text-xs sm:text-sm text-gray-400">{videoData?.channel?.subscribers}</p>
          </div>
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              isSubscribed 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2 w-full">
          <div className="flex bg-gray-800/50 rounded-full backdrop-blur-sm">
            <button 
              onClick={() => {
                setIsLiked(!isLiked);
                if (isDisliked) setIsDisliked(false);
              }}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-l-full hover:bg-gray-700/50 transition-colors ${
                isLiked ? 'text-blue-400' : 'text-white'
              }`}
            >
              <ThumbsUp size={16} />
              <span className="text-sm hidden sm:inline">{videoData?.likes || 0}</span>
            </button>
            <div className="w-px bg-gray-600"></div>
            <button 
              onClick={() => {
                setIsDisliked(!isDisliked);
                if (isLiked) setIsLiked(false);
              }}
              className={`px-3 sm:px-4 py-2 rounded-r-full hover:bg-gray-700/50 transition-colors ${
                isDisliked ? 'text-red-400' : 'text-white'
              }`}
            >
              <ThumbsDown size={16} />
            </button>
          </div>
          
          <button className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full hover:bg-gray-700/50 transition-colors">
            <Share size={16} />
            <span className="text-sm hidden sm:inline">Share</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full hover:bg-gray-700/50 transition-colors">
            <Download size={16} />
            <span className="text-sm hidden sm:inline">Download</span>
          </button>
              {
          isAuthor &&
          <>
            <button className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700/50 transition-colors">
            <Trash size={16} />
          </button>

          <button onClick={() => navigate(`/editvideo/${videoData._id}`)} className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700/50 transition-colors">
            <Pencil size={16} />
          </button>

          <button onClick={() => {
            setPublishStatus(!publishStatus)
            publishStatusHandler()
            }} className={`bg-gray-800/50 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700/50 transition-colors ${publishStatus ? 'text-green-500' : 'text-red-500'}`}>
            <Shell size={16} />
          </button>
          </>
          }
       
         
        </div>
      </div>
      
      <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl">
        <p className="text-sm text-gray-300 mb-2">
          views : {videoData?.views} • {date ? date.toLocaleTimeString() : ""}
        </p>
        <div className={`text-sm leading-relaxed ${showDescription ? '' : 'line-clamp-3'}`}>
          {videoData?.description?.split('\n').map((line, index) => (
            <p key={index} className="mb-1">{line}</p>
          ))}
        </div>
        <button 
          onClick={() => setShowDescription(!showDescription)}
          className="text-sm font-medium mt-2 hover:underline transition-colors"
        >
          {showDescription ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
};