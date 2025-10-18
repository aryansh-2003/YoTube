import React from "react";
import { MoreVertical } from "lucide-react";
import { formatVideoDuration , timeAgo } from "../TimeResolver";
import {useNavigate} from 'react-router'

export default function VideoCard({ video }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-2 text-white rounded-lg cursor-pointer hover:bg-neutral-800/40 transition">
      {/* Thumbnail */}
      <div className="w-full sm:w-72 relative rounded-xl overflow-hidden">
        <button className="w-full h-screen absolute" onClick={() => video?._id && navigate(`/video/${video._id}`)}>        </button>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full sm:h-40 object-cover rounded-xl"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1.5 py-0.5 rounded">
          {video ? `${formatVideoDuration(video.duration)}` : ""}
        </span>
      </div>

      <div className="flex flex-col justify-between sm:py-1 sm:px-1 flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold text-base sm:text-lg leading-snug line-clamp-2">
          <button className="w-full h- " onClick={() => video?._id && navigate(`/video/${video._id}`)}>        
            {video.title}
            </button>
          </h3>
          <MoreVertical size={18} className="text-gray-400 hidden sm:block" />
        </div>

        <div className="text-sm text-gray-400 mt-1">
          <span className="hover:text-gray-200">{video.ownerInfo?.[0]?.fullname}</span>
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
