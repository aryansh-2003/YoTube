import React from "react";

const VideoSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center w-full px-2 sm:px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex flex-col gap-2 bg-gray-800/50 rounded-xl p-2 shadow-md w-full max-w-xs"
        >
          {/* Video thumbnail */}
          <div className="bg-gray-700 rounded-xl w-full aspect-video"></div>

          {/* Video info */}
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className="bg-gray-700 rounded-full w-10 h-10 flex-shrink-0"></div>

            {/* Text */}
            <div className="flex flex-col gap-1 flex-1">
              <div className="bg-gray-700 h-4 w-3/4 rounded-md"></div>
              <div className="bg-gray-700 h-3 w-1/2 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoSkeleton;
