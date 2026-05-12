import React, { useEffect, useState, useRef, useMemo, memo, Suspense, lazy } from "react";
import { useNavigate } from "react-router";
import videoService from "../../Service/video";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- LAZY LOADED COMPONENTS (Code Splitting for performance) ---
const VideoCard = lazy(() => import("../components/video/VideoCard"));

// --- SUB-COMPONENT: HERO CAROUSEL ---
const HeroSection = memo(({ videos, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const autoSlideInterval = useRef(null);
  
  const hasData = videos && videos.length > 0;
  const activeVideo = hasData ? videos[currentIndex] : null;

  useEffect(() => {
    if (!hasData) return;
    const nextIndex = (currentIndex + 1) % videos.length;
    const img = new Image();
    img.src = videos[nextIndex].thumbnail;
  }, [currentIndex, hasData, videos]);

  useEffect(() => {
    if (hasData) startAutoSlide();
    return () => stopAutoSlide();
  }, [currentIndex, hasData]);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    }, 6000);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
  };

  const handleNext = () => setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));

  if (isLoading || !hasData) {
    return (
      <div className="relative w-full aspect-video md:h-[500px] rounded-[2rem] bg-slate-200 animate-pulse overflow-hidden shadow-sm border border-slate-100">
        <div className="absolute bottom-12 left-12 space-y-4 z-10">
          <div className="h-4 w-24 bg-slate-300 rounded"></div>
          <div className="h-10 w-48 md:w-96 bg-slate-300 rounded"></div>
          <div className="h-4 w-64 bg-slate-300 rounded"></div>
          <div className="h-12 w-36 bg-slate-300 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative w-full aspect-video md:h-[500px] rounded-[2rem] overflow-hidden group shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-slate-200/50 bg-[#0a0a0a]"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeVideo._id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img 
            src={activeVideo.thumbnail} 
            alt={activeVideo.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Dark gradients to make the image and white text pop dramatically */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 max-w-3xl z-10 pointer-events-none">
        <motion.span 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="inline-block px-3 py-1 mb-4 text-[11px] font-extrabold text-white bg-[#ff0000] rounded-md w-fit uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.5)]"
        >
          Featured
        </motion.span>
        
        <motion.h1 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-black leading-tight mb-2 md:mb-4 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] line-clamp-2"
        >
          {activeVideo.title}
        </motion.h1>
        
        <motion.p 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-gray-200 text-sm md:text-lg mb-6 line-clamp-2 max-w-xl font-medium drop-shadow-md"
        >
          {activeVideo.description}
        </motion.p>

        <motion.button 
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={() => navigate(`/video/${activeVideo._id}`)}
          className="pointer-events-auto flex items-center gap-2 md:px-6 px-4 py-2.5 md:py-3.5 bg-[#ff0000] hover:bg-[#dd0000] active:scale-95 text-white font-bold rounded-xl transition-all w-fit shadow-[0_8px_20px_rgba(255,0,0,0.3)] hover:shadow-[0_12px_25px_rgba(255,0,0,0.5)]"
        >
          <Play className="w-4 h-4 md:w-5 md:h-5" fill="white" />
          <span className="text-sm md:text-base tracking-wide uppercase">Watch now</span>
        </motion.button>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg border border-white/20"
      >
        <ChevronLeft size={28} />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg border border-white/20"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto bg-black/40 px-3 py-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-[#ff0000]" : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}, (prev, next) => prev.isLoading === next.isLoading && prev.videos?.[0]?._id === next.videos?.[0]?._id);


export default function Home() {
  const [videos, setVideos] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const heroVideos = useMemo(() => videos?.data?.data?.slice(0, 5) || [], [videos]);

  const fetchVideos = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await videoService.getHomeVids(page);
      if (res.status === 200) {
        setVideos(res);
        setTotalPages(Math.max(1, totalPages + 1));
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <>
      <main className="min-h-screen bg-slate-50 text-slate-900 w-full mt-8 md:mt-4 pb-12 relative z-10 font-sans">
        <div className="w-full max-w-[1600px] mx-auto space-y-10 px-4 md:px-8 pt-4">
          
          <HeroSection videos={heroVideos} isLoading={isLoading} />

          <section>
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Recommended for You</h2>
            </div>
            
            <div className="w-full">
               <Suspense fallback={<div className="text-center py-20 text-slate-500 font-medium">Loading recommendations...</div>}>
                 <VideoCard 
                   loading={isLoading} 
                   data={videos ? videos.data.data : null} 
                 />
               </Suspense>
            </div>
          </section>

          {/* Pagination Controls */}
          {!isLoading && videos && (
            <div className="flex justify-center items-center gap-4 pt-8 pb-4">
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-[#ff0000] hover:border-[#ff0000]/30 hover:shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                    <span className="px-5 py-2.5 bg-[#ff0000] rounded-xl text-sm font-bold text-white shadow-md">
                      {currentPage}
                    </span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages} 
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-[#ff0000] hover:border-[#ff0000]/30 hover:shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  Next
                </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}