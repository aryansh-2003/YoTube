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
        

    


      <div className="relative z-30 px-3 pt-6 sm:px-5 lg:px-8">

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