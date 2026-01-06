import React, { useContext, useEffect, useState } from "react";
import VideoPlayer from "../components/video/VideoPlayer";
import VideoInfo from "../components/video/VideoInfo";
import CommentsSection from "../components/CommentsSection";
import SidebarVideos from "../components/video/SidebarVideos";
import HeaderContext from "../components/context/HeaderContext";
import VideoService from "../../Service/video";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { vdo } from "../Store/videoSlice";
import { motion, AnimatePresence } from "framer-motion";

const WatchPage = () => {
  const { sidebarOpen } = useContext(HeaderContext);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const videoData = useSelector((state) => state?.video?.videoData?.[0]);

  useEffect(() => {
    if (!videoId) return;
    const load = async () => {
      try {
        const resp = await VideoService.getVideoById({ id: videoId });
        if (resp.status === 200 || resp.status === 201) {
          dispatch(vdo(resp.data.data));
          const info = resp.data.data[0];
          setCurrentVideo(info);
        } else {
          setCurrentVideo(null);
        }
      } catch (err) {
        console.error(err);
        setCurrentVideo(null);
      }
    };

    if (videoData && videoData._id === videoId) {
      setCurrentVideo(videoData);
    } else {
      load();
    }
  }, [videoId, videoData, dispatch]);

  const handleAddComment = (comment) => {
    setComments((prev) => [comment, ...prev]);
  };

  return (
    <div className="flex-1 min-h-screen relative bg-[#0f0f0f] text-white font-sans overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND SYSTEM --- */}
      {/* This creates the blurred 'glow' behind the player based on the thumbnail, matching the image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {currentVideo?.thumbnail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* The blurred background image */}
              <img
                src={currentVideo.thumbnail}
                alt="ambient"
                className="w-full h-full object-cover opacity-60 blur-[120px] scale-125 saturate-150"
              />
              {/* Gradient overlays to darken edges and focus attention on center */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/40 via-transparent to-[#0f0f0f]" />
              <div className="absolute inset-0 bg-black/20" /> 
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="relative z-10 max-w-[1800px] mx-auto px- sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* --- LEFT COLUMN (Player, Info, Comments) --- */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Video Player Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black relative group ring-1 ring-white/10"
            >
              <VideoPlayer
                currentVideo={currentVideo}
                onVideoEnd={() => console.log("Video ended")}
              />
            </motion.div>

            {/* Video Info Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-1"
            >
              <VideoInfo videoData={currentVideo} />
            </motion.div>

            {/* Comments Section (Glass Card style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
               {/* Divider before comments to match the clean look */}
              <div className="h-px w-full bg-white/10 mb-6" />
              
              <div className="bg-transparent lg:bg-transparent p-2">
                <CommentsSection
                  video={currentVideo}
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN (Sidebar / Up Next) --- */}
          <div className="lg:col-span-4 xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col h-full"
            >
              {/* "UP NEXT" Header - Matching the Gold Text in Image */}
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[#eab308] text-sm font-bold tracking-widest uppercase opacity-90">
                  Up Next
                </h3>
                {/* Optional toggle visual if needed, kept simple for now */}
              </div>

              {/* Sidebar Videos List - Transparent/Glassy */}
              <div className="flex-1 overflow-y-auto rounded-xl">
                <SidebarVideos query={currentVideo?.title || ""} />
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default WatchPage;