import React, { useContext, useEffect, useState } from "react";
import VideoCard from "../components/video/VideoCard";
import videoService from "../../Service/video";
import HeaderContext from "../components/context/HeaderContext";
import { Vortex } from "../components/ui/vortex"

export default function Home() {
  const [videos, setVideos] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { sidebarOpen } = useContext(HeaderContext);

  const fetchVideos = async (page = 1) => {
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
    }
  };

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  const handlePageChange = (page, action) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <main className={`relative flex- min-h-screen text-white overflow-hidden bg-[#0a0a0a] ${sidebarOpen ? "blur-sm" : ""}`}>
        {/* <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={50000}
        baseHue={1200}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      > */}
      
      {/* Sophisticated ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-[#0a0a0a] to-neutral-900/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/8 via-transparent to-transparent"></div>
      </div>

      {/* Subtle grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-10 mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      {/* Refined accent glows */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none z-10"></div>
      <div className="fixed bottom-40 right-1/3 w-[500px] h-[500px] bg-blue-500/4 rounded-full blur-[120px] pointer-events-none z-10"></div>

      {/* Main content */}
      <div className="relative z-30 px-3 pt-6 sm:px-5 lg:px-8">
        {/* Subtle top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Video Grid */}
        <div className="pt-">
          <VideoCard loading={false} data={videos ? videos?.data?.data : null} />
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 py-8 mt-6">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1, "Prev")}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-lg text-sm font-medium border backdrop-blur-sm ${
              currentPage === 1
                ? "border-white/5 text-white/30 cursor-not-allowed bg-white/[0.02]"
                : "border-white/10 text-white/70 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page, "Number")}
                  className={`min-w-[36px] h-9 px-3 flex items-center justify-center rounded-lg text-sm font-medium border backdrop-blur-sm ${
                    page === currentPage
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04] hover:border-white/10"
                  }`}
                >
                  {page}
                </button>
              ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1, "Next")}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-lg text-sm font-medium border backdrop-blur-sm ${
              currentPage === totalPages
                ? "border-white/5 text-white/30 cursor-not-allowed bg-white/[0.02]"
                : "border-white/10 text-white/70 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15"
            }`}
          >
            Next
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-white/40 pb-8">
          Page <span className="text-white/70 font-medium">{currentPage}</span> of{" "}
          <span className="text-white/70 font-medium">{totalPages}</span>
        </div>

        {/* Bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>
      </div>
      {/* </Vortex> */}
    </main>
  );
}