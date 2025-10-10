import { Play, Pause, Volume2, VolumeX, Maximize, Settings, MoreHorizontal, ThumbsUp, ThumbsDown, Share, Download, Flag, SkipBack, SkipForward, Repeat, Shuffle, Menu, Search, Bell, User } from 'lucide-react';


export default function SidebarVideos({ videos, onVideoClick }){
  return (
    <div className="space-y-3">
      {videos?.map((video) => (
        <div 
          key={video.id} 
          onClick={() => onVideoClick(video)}
          className="flex space-x-3 cursor-pointer hover:bg-gray-800/30 p-2 rounded-lg transition-all duration-200 group"
        >
          <div className="relative flex-shrink-0">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-32 h-20 sm:w-40 sm:h-24 object-cover rounded-lg group-hover:rounded-xl transition-all duration-200"
            />
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {video.duration}
            </span>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="text-white text-sm font-medium line-clamp-2 leading-tight group-hover:text-gray-200 transition-colors">
              {video.title}
            </h4>
            <p className="text-gray-400 text-xs hover:text-gray-300 transition-colors">
              {video.channel}
            </p>
            <div className="text-gray-400 text-xs space-x-1">
              <span>{video.views}</span>
              <span>•</span>
              <span>{video.publishedAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};