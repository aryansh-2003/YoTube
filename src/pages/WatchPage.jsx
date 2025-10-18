import { useContext, useEffect, useState } from "react";
import VideoPlayer from '../components/video/VideoPlayer'
import VideoInfo from "../components/video/VideoInfo";
import CommentsSection from '../components/CommentsSection'
import SidebarVideos  from '../components/video/SidebarVideos'
import HeaderContext from "../components/context/HeaderContext";
import VideoService  from '../../Service/video';
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { vdo } from "../Store/videoSlice";



const WatchPage = () => {

  const [currentVideo, setCurrentVideo] = useState()

  const [comments, setComments] = useState();

  const {videoId} = useParams()
  const videoData = useSelector(state => state?.video?.videoData?.[0])

  const dispatch = useDispatch()



  useEffect(()=>{
    if(!videoId) return
        const videoLoader = () =>{
         VideoService.getVideoById({id:videoId}).then((data)=>{
        if(data.status == 200 || 201){
          dispatch(vdo(data?.data?.data))
          const videoinfo = data?.data.data?.[0];
          setCurrentVideo(videoinfo)
        }else{
            setCurrentVideo(null)
        }
     }) 
    
    }

    if(videoData != null ){
      if(videoData._id == videoId){
        setCurrentVideo(videoData)
      }else{
        videoLoader()
      }
    }else{
      videoLoader()
    }
   
  },[])

  const handleAddComment = (comment) => {
    setComments([comment, ...comments]);
  };


  return (
    <div className={`flex-1 mr-2  min-h-screen text-white`}>
      <div className="mx-auto">
        <div className="lg:hidden">
          <div className="px-2 mr-2 py-4 space-y-6">
            <VideoPlayer 
              currentVideo={currentVideo}
              onVideoEnd={() => console.log('Video ended')}
            />
            <VideoInfo videoData={currentVideo} />
            
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-white font-semibold mb-4">Up Next</h3>
              <SidebarVideos 
                query={currentVideo ? currentVideo.title : ""}
              />
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <CommentsSection
                video={currentVideo}
                comments={comments}
                onAddComment={handleAddComment}
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
            <div className="xl:col-span-2 space-y-6">
              <VideoPlayer 
                currentVideo={currentVideo}
                onVideoEnd={() => console.log('Video ended')}
              />
              <VideoInfo videoData={currentVideo} />
              <CommentsSection
                video={currentVideo}
                comments={comments}
                onAddComment={handleAddComment}
              />
            </div>
            
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <SidebarVideos
                query={currentVideo ? currentVideo.title : ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;