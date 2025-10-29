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
  const videoData = useSelector(state => state?.video?.videoData?.[0]);

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
    setComments(prev => [comment, ...prev]);
  };

  return (
    <div className="flex-1 min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {/* Sophisticated animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {currentVideo?.thumbnail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full h-full relative"
            >
              <motion.img 
                src={currentVideo.thumbnail} 
                alt="" 
                animate={{
                  scale: [1.1, 1.15, 1.1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full object-cover opacity-[0.04] blur-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/95 via-[#0a0a0a]/90 to-[#0a0a0a]"></div>
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/30 via-transparent to-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated accent glow - right side */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed right-0 top-1/3 w-[600px] h-[600px] pointer-events-none hidden xl:block"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-violet-500/10 via-transparent to-transparent blur-[120px]"></div>
      </motion.div>

      {/* Animated accent - left side */}
      <motion.div
        animate={{
          x: [0, -20, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="fixed left-0 bottom-1/4 w-[400px] h-[400px] pointer-events-none hidden xl:block"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/8 via-transparent to-transparent blur-[100px]"></div>
      </motion.div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
            className="absolute w-1 h-1 bg-white/10 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Fine grain texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1600px]"
      >
        {/* Mobile view */}
        <div className="block lg:hidden space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VideoPlayer
              currentVideo={currentVideo}
              onVideoEnd={() => console.log("Video ended")}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <VideoInfo videoData={currentVideo} />
          </motion.div>
          
          {/* Up Next - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -2 }}
            className="bg-[#151515]/40 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 transition-all duration-300 hover:bg-[#151515]/50 hover:border-white/[0.08] relative group overflow-hidden"
          >
            {/* Hover shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            <h3 className="text-white/60 font-medium text-[11px] mb-3 tracking-[0.1em] uppercase relative z-10">
              Up Next
            </h3>
            <SidebarVideos query={currentVideo?.title || ""} />
          </motion.div>
          
          {/* Comments - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -2 }}
            className="bg-[#151515]/40 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 transition-all duration-300 hover:bg-[#151515]/50 hover:border-white/[0.08] relative group overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            <CommentsSection
              video={currentVideo}
              comments={comments}
              onAddComment={handleAddComment}
            />
          </motion.div>
        </div>

        {/* Desktop view */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-7">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VideoPlayer
                currentVideo={currentVideo}
                onVideoEnd={() => console.log("Video ended")}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <VideoInfo videoData={currentVideo} />
            </motion.div>
            
            {/* Comments - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -2 }}
              className="bg-[#151515]/40 backdrop-blur-md border border-white/[0.06] rounded-xl p-6 transition-all duration-300 hover:bg-[#151515]/50 hover:border-white/[0.08] relative group overflow-hidden"
            >
              {/* Hover shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              
              <div className="relative z-10">
                <CommentsSection
                  video={currentVideo}
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-6"
            >
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-[#151515]/40 backdrop-blur-md border border-white/[0.06] rounded-xl p-5 transition-all duration-300 hover:bg-[#151515]/50 hover:border-white/[0.08] relative group overflow-hidden"
              >
                {/* Hover shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                
                {/* Subtle pulsing border glow */}
                <motion.div
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-xl border border-violet-500/20 pointer-events-none"
                />
                
                <h3 className="text-white/60 font-medium text-[11px] mb-4 tracking-[0.1em] uppercase relative z-10">
                  Up Next
                </h3>
                <div className="relative z-10">
                  <SidebarVideos query={currentVideo?.title || ""} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WatchPage;