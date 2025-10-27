import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, ListPlus, Trash2 } from "lucide-react";
import PropTypes from "prop-types";

export default function VideoCard({ video, onUpdate, onDelete, onAddToPlaylist }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation();  // prevent parent card click
    setMenuOpen(prev => !prev);
  };

  const handleAction = (action) => {
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
    return () => {
      document.removeEventListener("mousedown", hideMenu);
    };
  }, []);

  return (
    <div
      className="relative p-4 bg-[#111] rounded-lg text-white cursor-pointer"
      onClick={() => {
        if (video?._id) {
          // navigate logic (if you have navigate) or other action
        }
      }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{video?.title || "Untitled"}</h3>
        <div ref={menuRef} className="relative">
          <MoreVertical
            size={20}
            className="text-gray-400 hover:text-orange-400"
            onClick={handleToggle}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1f1f1f] border border-white/10 shadow-lg rounded-md z-50">
              <button
                className="flex items-center gap-2 text-sm text-gray-200 px-3 py-2 w-full text-left hover:bg-orange-600/20"
                onClick={() => handleAction("update")}
              >
                <Pencil size={16} /> Update Video
              </button>
              <button
                className="flex items-center gap-2 text-sm text-gray-200 px-3 py-2 w-full text-left hover:bg-red-600/20"
                onClick={() => handleAction("delete")}
              >
                <Trash2 size={16} /> Delete
              </button>
              <button
                className="flex items-center gap-2 text-sm text-gray-200 px-3 py-2 w-full text-left hover:bg-blue-600/20"
                onClick={() => handleAction("playlist")}
              >
                <ListPlus size={16} /> Add to Playlist
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Could show thumbnail, views, etc here */}
    </div>
  );
}

VideoCard.propTypes = {
  video: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddToPlaylist: PropTypes.func.isRequired,
};
