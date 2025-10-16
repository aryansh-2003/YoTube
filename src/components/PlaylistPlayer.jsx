import React, { useState, useRef, useEffect } from "react";

const PlaylistPlayer = ({ playlistData }) => {
  console.log(playlistData)
  const videos = playlistData?.videos || [];
  const playlistInfo = playlistData?.response || {};
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Auto scroll to active video in sidebar
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
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl mx-auto p-4 bg-gray text-white rounded-2xl shadow-lg">
      <div className="flex-1">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
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

        <div className="mt-4">
          <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{currentVideo.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            {currentVideo.views} views
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentIndex === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === videos.length - 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentIndex === videos.length - 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="w-full md:w-80 bg-gray-800 rounded-xl overflow-y-auto max-h-[80vh]">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold">{playlistInfo.name}</h3>
          <p className="text-xs text-gray-400">{playlistInfo.description}</p>
        </div>

        <div className="divide-y divide-gray-700">
          {videos.map((vid, index) => (
            <div
              key={vid._id}
              id={`video-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                index === currentIndex
                  ? "bg-blue-600/30 border-l-4 border-blue-500"
                  : "hover:bg-gray-700"
              }`}
            >
              <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-semibold">
                    Now Playing
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium truncate">{vid.title}</h4>
                <p className="text-xs text-gray-400">
                  {Math.round(vid.duration)} sec • {vid.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPlayer;
