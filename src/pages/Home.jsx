import React, { useContext, useEffect, useState, useRef, useMemo, memo } from "react";
import { useNavigate } from "react-router";
import VideoCard from "../components/video/VideoCard";
import videoService from "../../Service/video";
import HeaderContext from "../components/context/HeaderContext";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// --- SUB-COMPONENT: HERO CAROUSEL (Isolated to prevent full page re-renders) ---
const HeroSection = memo(({ videos, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const autoSlideInterval = useRef(null);
  
  // Safe check for data
  const hasData = videos && videos.length > 0;
  const activeVideo = hasData ? videos[currentIndex] : null;

  // 1. Optimize Preloading: Only preload the NEXT image, not all of them
  useEffect(() => {
    if (!hasData) return;
    
    const nextIndex = (currentIndex + 1) % videos.length;
    const img = new Image();
    img.src = videos[nextIndex].thumbnail;
  }, [currentIndex, hasData, videos]);

  // 2. Carousel Interval Logic
  useEffect(() => {
    if (hasData) {
      startAutoSlide();
    }
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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  // --- SKELETON LOADER (Matches exact dimensions to fix CLS) ---
  if (isLoading || !hasData) {
    return (
      <div className="relative w-full aspect-video md:h-[500px] rounded-3xl bg-gray-800/50 animate-pulse overflow-hidden border border-white/5">
        <div className="absolute bottom-12 left-12 space-y-4 z-10">
          <div className="h-4 w-24 bg-gray-700 rounded"></div>
          <div className="h-10 w-48 md:w-96 bg-gray-700 rounded"></div>
          <div className="h-4 w-64 bg-gray-700 rounded"></div>
          <div className="h-12 w-36 bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative w-full aspect-video md:h-[500px] rounded-3xl overflow-hidden group border border-white/5 bg-[#1a1a1a]"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* Background Image - LCP Optimized */}
      <div className="absolute inset-0">
        <img 
          key={activeVideo._id} 
          src={activeVideo.thumbnail} 
          alt={activeVideo.title}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 max-w-3xl z-10 pointer-events-none">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-black bg-[#fbbf24] rounded-md w-fit uppercase tracking-wider">
          Featured
        </span>
        
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-lg line-clamp-2">
          {activeVideo.title}
        </h1>
        
        <p className="text-gray-200 text-base md:text-lg mb-8 line-clamp-2 drop-shadow-md max-w-xl">
          {activeVideo.description}
        </p>

        {/* Pointer events auto to allow clicking the button through the container overlay */}
        <button 
          onClick={() => navigate(`/video/${activeVideo._id}`)}
          className="pointer-events-auto flex items-center gap-3 px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] hover:scale-105 active:scale-95 text-black font-bold rounded-xl transition-all w-fit shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        >
          <Play size={20} fill="black" />
          <span>Watch Now</span>
        </button>
      </div>

      {/* Navigation Arrows - Using simple opacity transition to reduce paint cost */}
      <button 
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/80 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 border border-white/10"
      >
        <ChevronLeft size={28} />
      </button>
      
      <button 
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/80 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 border border-white/10"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 pointer-events-auto">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "w-8 bg-[#fbbf24]" 
                : "w-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for Memo: Only re-render if loading state changes or active video ID changes
  return prevProps.isLoading === nextProps.isLoading && 
         prevProps.videos?.[0]?._id === nextProps.videos?.[0]?._id;
});


export default function Home() {
  const [videos, setVideos] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const heroVideos = useMemo(() => {
    console.log(videos?.data?.data)
    return videos?.data?.data?.slice(0, 5) || [];
  }, [videos]);

  const fetchVideos = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await videoService.getHomeVids(page);
      if (res.status === 200) {
        setVideos(res);
        setTotalPages(Math.max(1, totalPages + 1)); // Adjust logic based on real API
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
    window.scrollTo({ top: 0, behavior: 'instant' }); // 'instant' is better for LCP on page switch than 'smooth'
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white w-full">
      <div className="max-w-[1800px] mx-auto space-y-8 p-4 md:p-6">
        
        <HeroSection videos={heroVideos} isLoading={isLoading} />

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
          </div>
          
          <div className="w-full">
             <VideoCard 
               loading={isLoading} 
               data={videos ? videos.data.data : null} 
             />
          </div>
        </section>

        {/* Pagination Controls */}
        {!isLoading && videos && (
          <div className="flex justify-center items-center gap-4 py-8 mt-4 border-t border-white/10">
             <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white disabled:opacity-30 transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-white/10 rounded-lg text-sm font-bold text-white border border-white/5">
                    {currentPage}
                  </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages} 
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white disabled:opacity-30 transition-colors"
              >
                Next
              </button>
          </div>
        )}
      </div>
    </main>
  );
}