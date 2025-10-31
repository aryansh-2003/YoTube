import React, { useContext, useEffect, useState } from "react";
import SearchFilters from "../components/Filter";
import VideoCard2 from "../components/video/VideoCard2";
import { SlidersHorizontal, Search, Loader2, Video, TrendingUp } from "lucide-react"; 
import videoService from '../../Service/video'
import HeaderContext from "../components/context/HeaderContext";

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const { inputvalue } = useContext(HeaderContext);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inputvalue) return;
    
    setLoading(true);
    videoService.getAllVideos({ query: inputvalue }).then((res) => {
      console.log(res);
      setResults(res?.data?.data);
      setLoading(false);
    }).catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [inputvalue]);

  const handleFilter = (data) => {
    setFilters(data);
    console.log("Applied filters:", data);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 pt-10 md:pt-12 sm:pt-12 pb-5 ">
      <div className="max- mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Search Results
                </h1>
                {inputvalue && (
                  <p className="text-neutral-400 text-sm mt-1">
                    Showing results for <span className="text-purple-400 font-medium">"{inputvalue}"</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-purple-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Stats Bar */}
          {results && results.length > 0 && (
            <div className="flex items-center gap-4 px-4 py-3 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span className="text-neutral-300 text-sm">
                  <span className="font-semibold text-white">{results.length}</span> videos found
                </span>
              </div>
              <div className="h-4 w-px bg-neutral-700"></div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <span className="text-neutral-300 text-sm">Most relevant</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Modal */}
        {showFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
              onClick={() => setShowFilters(false)}
            ></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in zoom-in duration-200">
              <SearchFilters
                onFilter={handleFilter}
                onClose={() => setShowFilters(false)}
              />
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-neutral-700 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-neutral-700 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-neutral-400 mt-6 text-lg font-medium">Searching videos...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && results && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-neutral-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-neutral-800 border-2 border-neutral-700 rounded-full flex items-center justify-center">
                <span className="text-xl">😔</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
            <p className="text-neutral-400 text-center max-w-md mb-6">
              We couldn't find any videos matching <span className="text-purple-400 font-medium">"{inputvalue}"</span>
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-xs text-neutral-500">Try searching for:</span>
              {['tutorials', 'vlogs', 'reviews', 'music'].map((suggestion) => (
                <button
                  key={suggestion}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-purple-500 text-neutral-300 text-sm rounded-full transition-all duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results && results.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.map((video, idx) => (
              <div 
                key={idx}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <VideoCard2 video={video} />
              </div>
            ))}
          </div>
        )}

        {/* Initial State (No search yet) */}
        {!loading && !results && !inputvalue && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start searching</h3>
            <p className="text-neutral-400 text-center max-w-md">
              Enter a search term in the search bar to find videos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}