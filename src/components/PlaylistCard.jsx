import React from "react";
import {useNavigate} from 'react-router'

const PlaylistCard = ({ thumbnail, name, description, videos , _id}) => {
  const navigate = useNavigate()
  return (
    <div className="w-full sm:w-[250px] md:w-[280px] bg-transparent cursor-pointer group">
      <div className="relative w-full aspect-video">
      
        <div className="absolute top-2 left-2 w-full h-full rounded-xl overflow-hidden bg-gray-800 opacity-60 scale-95 -z-20 shadow-md"></div>
        <div className="absolute top-1 left-1 w-full h-full rounded-xl overflow-hidden bg-gray-700 opacity-80 scale-97 -z-10 shadow-lg"></div>

        {/* Main front image */}
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl">
          <button className="w-full absolute h-screen  z-200 group-hover:scale-[1.03]" onClick={() => navigate(`/playlistvideos/${_id}`)}> </button>
          <img
            src={thumbnail || "https://9to5google.com/wp-content/uploads/sites/4/2023/03/youtube-music-logo-circle-4.jpg?quality=82&strip=all&w=1600"}
            alt={name}
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.4]"
            
          />
         

          {/* Overlay gradient (for slight realism) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Video count badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-[2px] rounded-md">
            {videos.length} videos
          </div>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-white text-sm sm:text-base font-semibold truncate">
          {name}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm">{description} · Playlist</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
