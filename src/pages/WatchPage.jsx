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
import { Maximize2, Minimize2, Activity, Eye, Calendar, Share2, Flag, Play } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- GLOBAL STYLES ---
const PageStyles = () => (
  <style>{`
    :root {
      --yt-red: #ff0000;
      --bg-light: #f8fafc; /* slate-50 */
      --surface-light: #ffffff;
    }
    .font-display { font-family: 'Clash Display', sans-serif; }
    .font-mono-sys { font-family: 'JetBrains Mono', monospace; }
    
    /* Custom Scrollbar for the page */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-light); }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--yt-red); }
  `}</style>
);

// --- TECHNICAL BADGE ---
const TechBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:border-[#ff0000]/50 hover:shadow-sm transition-all group">
    <Icon size={14} className="text-slate-400 group-hover:text-[#ff0000] transition-colors" />
    <span className="text-[10px] font-mono-sys text-slate-500 uppercase tracking-wider">{label}</span>
    <span className="text-[11px] font-mono-sys text-slate-800 font-bold">{value}</span>
  </div>
);

const WatchPage = () => {
  const { sidebarOpen } = useContext(HeaderContext);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
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
          setCurrentVideo(resp.data.data[0]);
        }
      } catch (err) {
        console.error(err);
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
    <>
      <PageStyles />
      <div className="flex-1 min-h-screen relative bg-[var(--bg-light)] text-slate-900 font-sans overflow-x-hidden selection:bg-[#ff0000]/20 selection:text-[#ff0000]">
        
        {/* --- DYNAMIC AMBIENT LIGHT (Adapted for bright theme) --- */}
        <div className="absolute top-0 left-0 right-0 h-[60vh] pointer-events-none z-0">
          <AnimatePresence mode="wait">
            {currentVideo?.thumbnail && (
              <motion.div
                key={currentVideo._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentVideo.thumbnail}
                  alt="ambient"
                  className="w-full h-full object-cover opacity-15 blur-[100px] scale-110 saturate-150 mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-light)]/80 to-[var(--bg-light)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className={cn(
          "relative z-10 mx-auto transition-all duration-500 ease-in-out px-4 md:px-8 py-6 pt-8",
          isCinemaMode ? "max-w-[1920px]" : "max-w-[1800px]"
        )}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT COLUMN: PLAYER & INFO --- */}
            <div className={cn(
              "flex flex-col gap-6 transition-all duration-500",
              isCinemaMode ? "lg:col-span-12" : "lg:col-span-8 xl:col-span-9"
            )}>
              
              {/* PLAYER FRAME */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="relative group bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200/50"
              >
                <div className="w-full relative">
                   <VideoPlayer
                     currentVideo={currentVideo}
                     onVideoEnd={() => console.log("Video ended")}
                   />
                </div>

                {/* Cinema Mode Toggle */}
                <button 
                  onClick={() => setIsCinemaMode(!isCinemaMode)}
                  className="absolute top-4 right-4 z-20 p-2 bg-black/60 backdrop-blur-md text-white/90 hover:text-[#ff0000] hover:bg-black/80 transition-all rounded-lg opacity-0 group-hover:opacity-100 shadow-md"
                >
                  {isCinemaMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </motion.div>

              {/* VIDEO METADATA BAR */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6"
              >
                 <h1 className="text-2xl md:text-3xl font-bold font-display leading-tight tracking-tight text-slate-900">
                   {currentVideo?.title || "Loading Video Data..."}
                 </h1>
                 
                 <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-[#ff0000] hover:text-white hover:shadow-md transition-all rounded-xl text-xs font-bold uppercase tracking-wide text-slate-700 border border-slate-200/50">
                      <Share2 size={16} /> Share
                    </button>
                    <button className="p-2.5 border border-slate-200/50 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all rounded-xl bg-slate-100">
                      <Flag size={16} />
                    </button>
                 </div>
              </motion.div>

              {/* DETAILED INFO & STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="md:col-span-2">
                   <VideoInfo videoData={currentVideo} />
                </div>
                
                {/* Technical Stats Column */}
                <div className="flex flex-col gap-2 pt-2 border-l border-slate-100 pl-6">
                   <div className="text-[11px] font-mono-sys text-slate-400 font-bold uppercase tracking-widest mb-1">Video Info</div>
                   <TechBadge icon={Eye} label="Views" value={currentVideo?.views?.toLocaleString() || "0"} />
                   <TechBadge icon={Calendar} label="Uploaded" value={new Date(currentVideo?.createdAt).toLocaleDateString()} />
                   <TechBadge icon={Activity} label="Status" value="Live" />
                </div>
              </div>

              {/* COMMENTS SECTION */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-8 border-t border-slate-200"
              >
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-1.5 h-6 rounded-full bg-[#ff0000]" />
                   <h3 className="font-display text-xl font-bold text-slate-900">Comments</h3>
                   <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{comments.length}</span>
                </div>
                
                <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl">
                  <CommentsSection
                    video={currentVideo}
                    comments={comments}
                    onAddComment={handleAddComment}
                  />
                </div>
              </motion.div>
            </div>

            {/* --- RIGHT COLUMN: UP NEXT --- */}
            {/* Hidden in cinema mode for focus */}
            {!isCinemaMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-4 xl:col-span-3 flex flex-col h-full"
              >
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                    <h3 className="text-[#ff0000] text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                      <Play size={16} className="fill-current" /> Up Next
                    </h3>
                  </div>

                  {/* Sidebar List */}
                  <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 p-2">
                    <SidebarVideos query={currentVideo?.title || ""} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchPage;