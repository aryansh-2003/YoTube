import React from "react";
import { MoreVertical } from "lucide-react";
import { formatVideoDuration , timeAgo } from "../TimeResolver";

export default function VideoCard({ video }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-2 text-white rounded-lg cursor-pointer hover:bg-neutral-800/40 transition">
      {/* Thumbnail */}
      <div className="w-full sm:w-72 relative rounded-xl overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-44 sm:h-40 object-cover rounded-xl"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1.5 py-0.5 rounded">
          {video ? `${formatVideoDuration(video.duration)}` : ""}
        </span>
      </div>

      <div className="flex flex-col justify-between sm:py-1 sm:px-1 flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold text-base sm:text-lg leading-snug line-clamp-2">
            {video.title}
          </h3>
          <MoreVertical size={18} className="text-gray-400 hidden sm:block" />
        </div>

        <div className="text-sm text-gray-400 mt-1">
          <span className="hover:text-gray-200">{video.owner}</span>
          <span className="mx-1">•</span>
          <span>{video.views} views</span>
          <span className="mx-1">•</span>
          <span>{video ? `${timeAgo(video.createdAt)}` : ""}</span>
        </div>

        {video.description && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
