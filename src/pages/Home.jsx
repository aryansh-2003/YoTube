import React, { useContext, useEffect, useState } from "react";
import VideoCard from "../components/video/VideoCard";
import videoService from "../../Service/video";
import HeaderContext from "../components/context/HeaderContext";
import PlaylistOverlay from "../components/PlaylistOverlay";

export default function Home() {
  const [videos, setVideos] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { sidebarOpen } = useContext(HeaderContext);

  const fetchVideos = async (page = 1) => {
    try {
      const res = await videoService.getHomeVids(page);
      if (res.status === 200) {
        console.log("hi")
        setVideos(res);
        setTotalPages(totalPages + 1);
      }else{
        setTotalPages(totalPages - 1)
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
    console.log(`Page ${action}:`, page); 
    setCurrentPage(page);
  };

  return (
    <main
      className={`flex-1 bg-black pt-2 min-h-screen text-white transition-all duration-300 ${
        sidebarOpen ? "blur-sm" : ""
      }`}
    >
      <div className="pt-5">
        <VideoCard
          loading={false}
          data={videos ? videos?.data?.data : null}
        />
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center gap-3 py-8 mt-6">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1, "Prev")}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border 
          ${
            currentPage === 1
              ? "border-gray-700 text-gray-600 cursor-not-allowed"
              : "border-red-500 hover:bg-red-600 hover:text-white"
          }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page, "Number")}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 
                ${
                  page === currentPage
                    ? "bg-gradient-to-r from-red-600 to-pink-600 shadow-lg shadow-red-500/30 text-white scale-105"
                    : "bg-[#1c1c1c] text-gray-400 hover:bg-red-600 hover:text-white"
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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border 
          ${
            currentPage === totalPages
              ? "border-gray-700 text-gray-600 cursor-not-allowed"
              : "border-red-500 hover:bg-red-600 hover:text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Current Page Info */}
      <div className="text-center text-sm text-gray-400 pb-6">
        Page <span className="text-red-500 font-semibold">{currentPage}</span> of{" "}
        <span className="text-gray-300">{totalPages}</span>
      </div>
    </main>
  );
}
