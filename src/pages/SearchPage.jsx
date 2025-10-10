import React, { useContext, useEffect, useState } from "react";
import SearchFilters from "../components/Filter";
import VideoCard2 from "../components/video/VideoCard2";
import { SlidersHorizontal } from "lucide-react"; 
import videoService from '../../Service/video'
import HeaderContext from "../components/context/HeaderContext";

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const {inputvalue} = useContext(HeaderContext)
  const [results, setResults] = useState();

  useEffect(() => {
    if(!inputvalue) return
    videoService.getAllVideos({query:inputvalue}).then((res) => {
      console.log(res)
      setResults(res?.data?.data)
      // if(res.status)
    })
  },[inputvalue])

  const handleFilter = (data) => {
    setFilters(data);
    console.log("Applied filters:", data);
    setShowFilters(false);
    // TODO: call API with filters
  };

  return (
    <div className="p-4 relative ml-[5%]">
      {/* Search Bar & Filter Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">Search Results</h2>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Filter Popup */}
      {showFilters && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
          <SearchFilters
            onFilter={handleFilter}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}
      {results ? results.length === 0 ?
      <>
      <h1>Sorry no videos found</h1>
      </>
      :
      <>
         <div className="mt-6 space-y-4">
        {results.map((video, idx) => (
          <VideoCard2 key={idx} video={video} />
        ))}
      </div>
      </>
      : "...Loading"}
     

      {/* Overlay background when filters are open */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setShowFilters(false)}
        ></div>
      )}
    </div>
  );
}
