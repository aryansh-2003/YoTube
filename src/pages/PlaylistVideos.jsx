import React, { useContext, useEffect, useState } from 'react'
import VideoCard from '../components/video/VideoCard'
import playlistService from '../../Service/playlist'
import { useParams } from 'react-router';
import PlaylistPlayer from '../components/PlaylistPlayer'


export default function PlaylistVideos() {
  const [data,setData] = useState()
  const {playlistid} = useParams()
  

  useEffect(()=>{
      playlistService.getPlaylistById({playlistId:playlistid}).then((res) => {
        if(res.staus === 200 || 201){
          setData(res?.data)
        }
      })
  },[playlistid])

  console.log(data?.data)


  return (
    <main className={`flex-1 bg-black  pt-2 min-h-screen text-white`}>

      <div className="pt-5">
                 <PlaylistPlayer playlistData={data ? data?.data : "" }/>
                
        </div>
    </main>
    
  );
};
