import React from "react";
import VideoCard from "./video/VideoCard"; // Assuming this is your existing component
import defaultAvatar from "../assets/download.jpeg";
import { MessageSquare, Heart, Share2, ListVideo, ChevronRight } from "lucide-react";

// Mock Data - Professional Placeholders
const mockTweets = [
  {
    id: 1,
    owner: { name: "ChalChitram Official", username: "chalchitram", avatar: defaultAvatar },
    time: "2h ago",
    content: "We've just updated our Creator Studio dashboard. You can now analyze your audience retention metrics with greater precision. Check the 'Analytics' tab.",
    stats: { likes: 1240, comments: 45 }
  },
  {
    id: 2,
    owner: { name: "Dev Community", username: "dev_community", avatar: defaultAvatar },
    time: "5h ago",
    content: "System maintenance scheduled for tonight at 02:00 UTC. Uploads might be paused for approximately 30 minutes.",
    stats: { likes: 856, comments: 12 }
  },
  {
    id: 3,
    owner: { name: "Design Hub", username: "design_hub", avatar: defaultAvatar },
    time: "1d ago",
    content: "New tutorial series on 'Cinematic Color Grading' drops this Friday. Don't miss it!",
    stats: { likes: 2100, comments: 89 }
  },
];

const mockPlaylists = [
  {
    id: 1,
    title: "Cinematic Storytelling",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    videosCount: 12,
    updated: "Updated today"
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    videosCount: 8,
    updated: "Updated 2 days ago"
  },
  {
    id: 3,
    title: "Filmmaking 101",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    videosCount: 24,
    updated: "Updated last week"
  },
  {
    id: 4,
    title: "Tech Reviews 2025",
    thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    videosCount: 15,
    updated: "Updated yesterday"
  },
];

// Reusable Section Header to ensure consistency
const SectionHeader = ({ title, actionText = "View All" }) => (
  <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-2">
    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
    <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider group">
      {actionText}
      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default function HomeSection() {
  return (
    <div className="w-full space-y-12 pb-12">
      
      {/* 1. COMMUNITY UPDATES (Tweets) */}
      <section>
        <SectionHeader title="Community Updates" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockTweets.map((tweet) => (
            <div
              key={tweet.id}
              className="bg-[#1a1a1a] border border-[#272727] p-5 rounded-xl hover:border-white/20 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={tweet.owner.avatar}
                  alt={tweet.owner.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#272727]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white truncate">
                      {tweet.owner.name}
                    </span>
                    <span className="text-xs text-gray-500">{tweet.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {tweet.content}
                  </p>
                  
                  {/* Interaction Bar */}
                  <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                    <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#E1AD01] transition-colors">
                      <Heart size={14} />
                      <span>{tweet.stats.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
                      <MessageSquare size={14} />
                      <span>{tweet.stats.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors ml-auto">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. LATEST VIDEOS */}
      <section>
        <SectionHeader title="Latest Videos" />
        {/* Uses your existing grid system from VideoCard */}
        <div className="w-full">
           <VideoCard data={[]} /> 
        </div>
      </section>

      {/* 3. FEATURED PLAYLISTS */}
      <section>
        <SectionHeader title="Featured Playlists" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="group cursor-pointer bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors duration-200 rounded-xl overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-[#272727]">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Playlist Overlay Strip */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white border-l border-white/10">
                    <span className="text-lg font-bold">{playlist.videosCount}</span>
                    <ListVideo size={20} className="mt-1 opacity-70" />
                </div>
                
                {/* Hover Play Icon */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Playlist Info */}
              <div className="px-1">
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#E1AD01] transition-colors">
                  {playlist.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                   {playlist.updated} • View full playlist
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}