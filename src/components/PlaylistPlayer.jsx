import React, { useState, useRef, useEffect } from "react";
import playlistService from "../../Service/playlist";

const PlaylistPlayer = ({ playlistData }) => {
  const videos = playlistData?.videos || [];
  const playlistInfo = playlistData?.response || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [videoToRemove, setVideoToRemove] = useState(null);
  const videoRef = useRef(null);

  const currentVideo = videos[currentIndex];

  const handleEnded = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleRemoveClick = (video) => {
    setVideoToRemove(video);
    setConfirmOpen(true);
    setMenuOpenIndex(null);
  };

  const confirmRemove = () => {
    playlistService
      .deleteVideoFromPlaylist({
        playlistId: playlistData?.response._id,
        videoId: videoToRemove._id,
      })
      .then((res) => {
        console.log(res);
      });
    setConfirmOpen(false);
    setVideoToRemove(null);
  };

  useEffect(() => {
    const activeItem = document.getElementById(`video-${currentIndex}`);
    activeItem?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentIndex]);

  if (!videos.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No videos found in this playlist.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto p-4 md:p-6  rounded-3xl shadow-2xl relative">
      {/* Video Player */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            key={currentVideo._id}
            src={currentVideo.videoFile}
            poster={currentVideo.thumbnail}
            className="w-full h-full object-contain"
            controls
            autoPlay
            onEnded={handleEnded}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">{currentVideo.title}</h2>
          <p className="text-gray-400 text-sm">{currentVideo.description}</p>
          <p className="text-gray-500 text-xs">
            {currentVideo.views} views
          </p>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-5 py-2 rounded-xl font-semibold transition transform ${
              currentIndex === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
            }`}
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === videos.length - 1}
            className={`px-5 py-2 rounded-xl font-semibold transition transform ${
              currentIndex === videos.length - 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-80 bg-gray-800 rounded-2xl overflow-y-auto max-h-[80vh] shadow-inner">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">{playlistInfo.name}</h3>
          <p className="text-gray-400 text-sm">{playlistInfo.description}</p>
        </div>

        <div className="divide-y divide-gray-700 relative">
          {videos.map((vid, index) => (
            <div
              key={vid._id}
              id={`video-${index}`}
              className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all transform ${
                index === currentIndex
                  ? "bg-gradient-to-r from-blue-500/40 via-purple-500/30 to-pink-500/20 border-l-4 border-blue-400 shadow-lg scale-[1.02]"
                  : "hover:bg-gray-700 hover:scale-[1.01]"
              }`}
            >
              <div
                onClick={() => setCurrentIndex(index)}
                className="flex items-center gap-3 flex-1"
              >
                <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-semibold text-white rounded-lg">
                      Now Playing
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-medium text-white truncate">{vid.title}</h4>
                  <p className="text-xs text-gray-400 truncate">
                    {Math.round(vid.duration)} sec • {vid.views} views
                  </p>
                </div>
              </div>

              {/* Three-dot menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenIndex(menuOpenIndex === index ? null : index);
                  }}
                  className="p-2 rounded-full hover:bg-gray-700 transition"
                >
                  ⋮
                </button>

                {menuOpenIndex === index && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-50">
                    <button
                      onClick={() => handleRemoveClick(vid)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400 rounded-t-lg"
                    >
                      Remove from playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-80 text-center">
            <h3 className="text-lg font-semibold mb-2 text-white">Remove Video?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-white">{videoToRemove?.title}</span> from this playlist?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPlayer;
