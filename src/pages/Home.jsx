import React, { useContext, useEffect, useState } from "react";
import VideoCard from "../components/video/VideoCard";
import videoService from "../../Service/video";
import HeaderContext from "../components/context/HeaderContext";
import { ChevronLeft, ChevronRight, Play } from "lucide-react"; // Make sure to install lucide-react if needed

export default function Home() {
  const [videos, setVideos] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { sidebarOpen } = useContext(HeaderContext);

  // Mock data for the Featured Hero Section to match the image
  const featuredVideo = {
    title: "Cinematic Journeys: The Art of Storytelling",
    description: "Cinematic Journeys: The Art of Storytelling, an adventure ahingnoroeat undreanding the world...",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop", // Placeholder cinematic image
    tag: "FEATURED VIDEO"
  };

  const fetchVideos = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await videoService.getHomeVids(page);
      if (res.status === 200) {
        setVideos(res);
        setTotalPages(totalPages + 1); // Adjust based on your API response
      } else {
        setTotalPages(totalPages - 1);
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
    // Main Container - Matches the dark background of the content area
    <main 
      className={`min-h-screen bg-[#0f0f0f] text-white w-full transition-all duration-300 ${
        sidebarOpen ? "pl-0" : "" 
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-8">
        
        {/* --- FEATURED HERO SECTION --- */}
        <section className="relative w-full h-[400px] rounded-3xl overflow-hidden group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={featuredVideo.image} 
              alt="Featured" 
              className="w-full h-full object-cover object-top"
            />
            {/* Gradient Overlay - Dark fade from left to right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Featured Content Text */}
          <div className="absolute inset-0 flex flex-col justify-center p-12 max-w-2xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-black bg-[#fbbf24] rounded-md w-fit">
              {featuredVideo.tag}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-white">
              {featuredVideo.title}
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 line-clamp-2">
              {featuredVideo.description}
            </p>

            <button className="flex items-center gap-2 px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-bold rounded-xl transition-colors w-fit">
              <span>Watch Now</span>
            </button>
          </div>

          {/* Carousel Arrows (Visual only for now) */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={24} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={24} />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-8 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          </div>
        </section>

        {/* --- RECOMMENDED SECTION --- */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Recommended for You</h2>
          
          {/* Video Grid */}
          <div className=" gap-6">
             <VideoCard 
               loading={isLoading} 
               data={videos ? videos?.data?.data : null} 
             />
          </div>
        </section>

        {/* --- PAGINATION (Kept clean) --- */}
        {videos && (
          <div className="flex justify-center items-center gap-4 py-8 mt-4 border-t border-white/10">
             <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white disabled:opacity-30 disabled:hover:text-white/70 transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-md text-sm font-bold text-white">
                    {currentPage}
                  </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white disabled:opacity-30 disabled:hover:text-white/70 transition-colors"
              >
                Next
              </button>
          </div>
        )}
      </div>
    </main>
  );
}