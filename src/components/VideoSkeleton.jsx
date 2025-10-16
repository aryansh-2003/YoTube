import React from "react";

const VideoSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg overflow-hidden"
        >
          <div className="bg-gray-700 h-40 w-[70%] rounded-2xl"></div>

          <div className="pt-2">
            <div className="w-full flex flex-row items-center">
            <div className="bg-gray-700 w-10 h-10 mb-2 rounded-full"></div>
            <div className="w-full gap-2 ml-2">
            <div className="bg-gray-700 h-4 w-2/4 mb-2 rounded"></div>
            <div className="bg-gray-700 h-3 w-1/4 rounded"></div>
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoSkeleton;
