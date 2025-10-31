import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, ListPlus, Trash2, Play, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

export default function VideoCard({ video, onUpdate, onDelete, onAddToPlaylist }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
console.log(video)
  const handleToggle = (e) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!video?._id) return;
    if (action === "update") onUpdate(video._id);
    if (action === "delete") onDelete(video._id);
    if (action === "playlist") onAddToPlaylist(video._id);
  };

  useEffect(() => {
    const hideMenu = (ev) => {
      if (menuRef.current && !menuRef.current.contains(ev.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", hideMenu);
    return () => document.removeEventListener("mousedown", hideMenu);
  }, []);

  const formatDuration = (duration) => {
    const seconds = Math.floor(parseFloat(duration || 0));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  return (
    <div className="group relative bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-800/50 hover:border-purple-500/30 transition-colors duration-200 cursor-pointer will-change-transform">
      {/* Mobile/Tablet Layout (Vertical) - Default */}
      <div className="md:hidden">
        {/* Thumbnail Section */}
        <div className="relative aspect-video bg-neutral-800/50 overflow-hidden">
          <img
            src={video?.thumbnail}
            alt={video?.title || 'Video'}
            loading="lazy"
            onClick={() => navigate(`/home`)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Play Overlay */}
          <button classsname="bg-red-200 z-20 absolute w-200 h-200 " onClick={() => navigate(`/video/${video ? video._id : ""}`)}>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center">
                  <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                </div>
              </div>
          </button>

          {/* Duration Badge */}
          {video?.duration && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/90 rounded text-xs text-white font-medium">
              {formatDuration(video.duration)}
            </div>
          )}

          {/* Menu Button */}
          <div ref={menuRef} className="absolute top-2 right-2">
            <button
              onClick={handleToggle}
              className="p-1.5 bg-black/70 hover:bg-black/90 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              aria-label="More options"
            >
              <MoreVertical size={16} className="text-white" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-neutral-800 border border-neutral-700 shadow-xl rounded-md overflow-hidden z-50">
                <button
                  className="flex items-center gap-2.5 text-sm text-white px-3 py-2.5 w-full hover:bg-purple-600/15"
                  onClick={(e) => handleAction("update", e)}
                >
                  <Pencil size={15} className="text-purple-400" />
                  Update
                </button>
                <button
                  className="flex items-center gap-2.5 text-sm text-white px-3 py-2.5 w-full hover:bg-blue-600/15"
                  onClick={(e) => handleAction("playlist", e)}
                >
                  <ListPlus size={15} className="text-blue-400" />
                  Add to Playlist
                </button>
                <button
                  className="flex items-center gap-2.5 text-sm text-white px-3 py-2.5 w-full hover:bg-red-600/15"
                  onClick={(e) => handleAction("delete", e)}
                >
                  <Trash2 size={15} className="text-red-400" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3">
          <div className="flex gap-2.5">
          <button classsname="bg-red-200 z-20 absolute w-200 h-200 " onClick={() => navigate(`/channel/${video ? video?.ownerInfo?.[0]?.username : ""}`)}>
            <img
              src={video?.ownerInfo?.[0]?.avatar}
              alt={video?.ownerInfo?.[0]?.fullname}
              loading="lazy"
              className="w-9 h-9 rounded-full flex-shrink-0 object-contain"
            />
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white text-sm mb-0.5 line-clamp-2 leading-snug">
                {video?.title || "Untitled"}
              </h3>
            <button classsname="bg-red-200 z-20 absolute w-200 h-200 " onClick={() => navigate(`/channel/${video ? video?.ownerInfo?.[0]?.username : ""}`)}>
              <p className="text-neutral-400 text-xs mb-1 truncate">
                {video?.ownerInfo?.[0]?.fullname}
              </p>
            </button>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  {formatViews(video?.views)}
                </span>
                <span>•</span>
                <span>{formatDate(video?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (Horizontal) - md and above */}
      <div className="hidden md:flex gap-4 p-3">
        {/* Thumbnail Section - Left Side */}
        <div className="relative w-80 flex-shrink-0">
          <div className="relative aspect-video bg-neutral-800/50 overflow-hidden rounded-lg">
            <img
              src={video?.thumbnail}
              alt={video?.title || 'Video'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Play Overlay */}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
              <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center">
                <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
              </div>
            </div>

            {/* Duration Badge */}
            {video?.duration && (
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/90 rounded text-xs text-white font-medium">
                {formatDuration(video.duration)}
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Right Side */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h3 className="font-medium text-white text-base mb-2 line-clamp-2 leading-snug">
              {video?.title || "Untitled"}
            </h3>

            {/* Stats */}
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViews(video?.views)} views
              </span>
              <span>•</span>
              <span>{formatDate(video?.createdAt)}</span>
            </div>

            {/* Channel Info */}
            <div className="flex items-center gap-2.5 mb-3">
          <button classsname="bg-red-200 z-20 absolute w-200 h-200 " onClick={() => navigate(`/channel/${video ? video?.ownerInfo?.[0]?.username : ""}`)}>
              <img
                src={video?.ownerInfo?.[0]?.avatar}
                alt={video?.ownerInfo?.[0]?.fullname}
                loading="lazy"
                className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
              />
              <span className="text-neutral-400 text-sm truncate">
                {video?.ownerInfo?.[0]?.fullname}
              </span>
          </button>
            </div>

            {/* Description */}
            {video?.description && (
              <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            )}
          </div>

          {/* Menu Button - Bottom Right */}
          <div ref={menuRef} className="flex justify-end mt-2">
            <button
              onClick={handleToggle}
              className="p-2 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={18} className="text-neutral-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-3 mt-10 w-44 bg-neutral-800 border border-neutral-700 shadow-xl rounded-md overflow-hidden z-50">
                <button
                  className="flex items-center gap-2.5 text-sm text-white px-3 py-2.5 w-full hover:bg-purple-600/15"
                  onClick={(e) => handleAction("update", e)}
                >
                  <Pencil size={15} className="text-purple-400" />
                  Update
                </button>
                <button
                  className="flex items-center gap-2.5 text-sm text-white px-3 py-2.5 w-full hover:bg-blue-600/15"
                  onClick={(e) => handleAction("playlist", e)}
                >
                  <ListPlus size={15} className="text-blue-400" />
                  Add to Playlist
                </button>
                <button
                  className="flex items-center gap-2.5 text-sm text-white px-3 py-2.5 w-full hover:bg-red-600/15"
                  onClick={(e) => handleAction("delete", e)}
                >
                  <Trash2 size={15} className="text-red-400" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

VideoCard.propTypes = {
  video: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddToPlaylist: PropTypes.func.isRequired,
};