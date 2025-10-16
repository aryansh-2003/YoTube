// import useChannelData from "../hooks/useChannelData";
import { useEffect, useState } from "react";
import ChannelCover from "../components/userProfile/ChannelCover";
import ChannelInfo from "../components/userProfile/ChannelInfo";
import Tabs from "../components/userProfile/Tabs";
// import { mockChannelData } from "../hooks/useChannelData"; 
import { useParams } from "react-router";
import authService from '../../Service/auth'
// import videoCard from '../components/userProfile/VideoCard'
import { mockVideos } from "../hooks/mockVideos.js";
import dashboardService from '../../Service/dashboard.js'


export default function ChannelPage() {
//   const { channel, loading } = useChannelData(username);
  // const channel = channeldata;
  const {username} = useParams()
  const [channeldata, setchanneldata] = useState()
  const [videos,setvideos] = useState()


  console.log(videos)



  useEffect(() => {
    if (!useParams ) return
    authService.getUserChannel({channel: username}).then((res) => {
        console.log(res)
        setchanneldata(res?.data?.data)
        dashboardService.getChannelVideos(res?.data?.data?._id).then((res)=>{
        console.log(res)
        setvideos(res?.data?.data)
      })
    })

   
  },[])
    const channel = channeldata;
 
//   if (loading)
//     return <div className="text-center text-gray-400 mt-20">Loading...</div>;

  if (!channel)
    return <div className="text-center text-red-400 mt-20">Channel not found.</div>;

  return (
    <div className="bg-black text-white min-h-screen">
      <ChannelCover coverImage={channel.coverImage} />
      <ChannelInfo channel={channel} />
      <Tabs />
      <div className="px-6 md:px-10 py-6">
        {/* Add your video section here */}
        <h2 className="text-xl font-semibold mb-4">
          {channel.fullname.toUpperCase()} - Latest Uploads
        </h2>
        
        <div className="grid sm:grid-rows-2 md:grid-rows-3 gap-6">
          {videos ? videos.map((video) => (
            <div key={video._id} className="flex flex-row gap-2">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="aspect-[16/9] w-[20%] rounded-lg hover:scale-105 transition-transform duration-200"
              />
              <div className="flex flex-col gap-2">
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-gray-400 text-sm">
                {video.views.toLocaleString()} views • {video.uploadedAt}
              </p>
              <p className="text-gray-500 text-xs line-clamp-5">{video.description}</p>
              </div>
            </div>
          )): "...Nothing to show"}
        </div>;
      </div>
    </div>
  );
}
