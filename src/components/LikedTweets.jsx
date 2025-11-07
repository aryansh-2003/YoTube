import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";

export default function LikedTweetComponent({ tweet }) {
  const [isLiked, setIsLiked] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Mock data - replace with your actual data
  const tweetData = tweet || {
    id: 1,
    author: {
      name: "Sarah Chen",
      username: "@sarahchen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    content: "Just deployed my first AI-powered feature in production! The feeling when everything works perfectly on the first try is unmatched. 🚀✨",
    timestamp: "2h ago",
    likes: 234,
    comments: 45,
    likedAt: "Liked 30 minutes ago"
  };

  const handleUnlike = () => {
    setIsAnimating(true);
    // API call to unlike
    // tweetService.unlikeTweet(tweetData.id).then(res => {
    //   if (res.status === 200) {
    //     setIsLiked(false);
    //   }
    // });
    
    setTimeout(() => {
      setIsLiked(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // API call to save/unsave
    // tweetService.saveTweet(tweetData.id).then(res => { ... });
  };

  const handleRemoveFromLiked = () => {
    setIsRemoving(true);
    // API call to remove from liked
    // tweetService.removeFromLiked(tweetData.id).then(res => { ... });
    
    setTimeout(() => {
      // This would trigger a refresh in the parent component
      console.log("Removed from liked tweets");
    }, 500);
  };

  const handleShare = () => {
    // API call or share functionality
    console.log("Share tweet", tweetData.id);
  };

  return (
    <div
      className={`group relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-5 transition-all duration-500 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-zinc-900/30 ${
        isRemoving ? "opacity-0 scale-95 translate-x-8" : "opacity-100 scale-100"
      }`}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-700/0 to-zinc-600/0 group-hover:from-zinc-700/5 group-hover:to-zinc-600/5 transition-all duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar with animation */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 p-0.5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <img
                  src={tweetData.author.avatar}
                  alt={tweetData.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {/* Liked indicator pulse */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center border-2 border-zinc-900 animate-pulse">
                <Heart className="w-3 h-3 text-white fill-white" />
              </div>
            </div>

            <div>
              <h3 className="text-zinc-100 font-semibold text-sm hover:text-zinc-50 transition-colors">
                {tweetData.author.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>{tweetData.author.username}</span>
                <span>•</span>
                <span className="hover:text-zinc-400 transition-colors">
                  {tweetData.timestamp}
                </span>
              </div>
            </div>
          </div>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-zinc-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800/50 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={handleRemoveFromLiked}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove from Liked
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-zinc-300 text-sm leading-relaxed mb-4 group-hover:text-zinc-200 transition-colors duration-300">
          {tweetData.content}
        </p>

        {/* Liked timestamp */}
        <div className="flex items-center gap-2 mb-4 text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">
          <Heart className="w-3 h-3 fill-zinc-600" />
          <span>{tweetData.likedAt}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-4"></div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Unlike button */}
            <button
              onClick={handleUnlike}
              className={`group/btn flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                isLiked
                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  : "hover:bg-zinc-800/50 text-zinc-500"
              } ${isAnimating ? "scale-90" : "scale-100"}`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isLiked ? "fill-red-400 scale-110" : ""
                } group-hover/btn:scale-125`}
              />
              <span className="text-xs font-medium">{tweetData.likes}</span>
            </button>

            {/* Comment button */}
            <button className="group/btn flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-500/10 text-zinc-500 hover:text-blue-400 transition-all duration-300">
              <MessageCircle className="w-4 h-4 group-hover/btn:scale-125 transition-transform duration-300" />
              <span className="text-xs font-medium">{tweetData.comments}</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="group/btn flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-500/10 text-zinc-500 hover:text-green-400 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-all duration-300" />
            </button>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`group/save p-2 rounded-xl transition-all duration-300 ${
              isSaved
                ? "bg-yellow-500/10 text-yellow-400"
                : "hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-300 ${
                isSaved ? "fill-yellow-400 scale-110" : ""
              } group-hover/save:scale-125 group-hover/save:-rotate-12`}
            />
          </button>
        </div>

        {/* Interaction feedback overlay */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-ping">
              <Heart className="w-16 h-16 text-red-400/30 fill-red-400/30" />
            </div>
          </div>
        )}
      </div>

      {/* Hover gradient border effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-700/20 via-transparent to-zinc-600/20"></div>
      </div>
    </div>
  );
}


