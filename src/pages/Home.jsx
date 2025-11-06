import React, { useContext, useEffect, useState } from "react";
import VideoCard from "../components/video/VideoCard";
import videoService from "../../Service/video";
import HeaderContext from "../components/context/HeaderContext";

export default function Home() {
  const [videos, setVideos] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { sidebarOpen } = useContext(HeaderContext);

  const fetchVideos = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await videoService.getHomeVids(page);
      if (res.status === 200) {
        setVideos(res);
        setTotalPages(totalPages + 1);
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

  const handlePageChange = (page, action) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={`relative min-h-screen bg-black transition-all duration-300 ${sidebarOpen ? "blur-sm" : ""}`}>
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]"></div>

      <div className="relative z-10 w-full">
        {/* Compact Header Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="space-y-3 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-white/70 tracking-wider">DISCOVER CONTENT</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Explore Premium Video Collection
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-[1600px] mx-auto">
            {/* Video Grid */}
            <div className="mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <VideoCard 
                loading={isLoading} 
                data={videos ? videos?.data?.data : null} 
              />
            </div>

            {/* Pagination Section */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {/* Divider */}
              <div className="h-px bg-white/5"></div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1, "Prev")}
                  disabled={currentPage === 1}
                  className={`group relative px-6 py-2.5 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-105"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page, "Number")}
                        className={`relative min-w-[40px] h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          page === currentPage
                            ? "bg-white text-black shadow-lg shadow-white/20 scale-105"
                            : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 hover:border-white/30 hover:text-white hover:scale-105"
                        }`}
                      >
                        <span className="relative">{page}</span>
                      </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1, "Next")}
                  disabled={currentPage === totalPages}
                  className={`group relative px-6 py-2.5 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-105"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    Next
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Page Info */}
              <div className="text-center">
                <p className="text-sm text-white/50 font-medium">
                  Page{" "}
                  <span className="text-white font-bold">{currentPage}</span>
                  {" "}of{" "}
                  <span className="text-white font-bold">{totalPages}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}