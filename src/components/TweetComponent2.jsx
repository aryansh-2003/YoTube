import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Verified, Bookmark, X, Edit2, Trash2, Send } from 'lucide-react';
import {timeAgo} from './TimeResolver'
import likeservice from '../../Service/like'

const TweetComponent2 = ({ tweet, onEdit, onDelete }) => {
  const [liked, setLiked] = useState(tweet.isLiked || false);
  const [retweeted, setRetweeted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(tweet.totalLikes || 0);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      time: "5m",
      content: "Great insight! Really appreciate this perspective."
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "janesmith",
      time: "12m",
      content: "This is exactly what I needed to hear today. Thanks for sharing!"
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLikeAnimating(true);
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    likeservice.likeTweet(tweet?._id).then((res) => {
      console.log(res)
    })
    setTimeout(() => setIsLikeAnimating(false), 600);
  };

  const handleBookmark = () => {
    setIsBookmarkAnimating(true);
    setBookmarked(!bookmarked);
    setTimeout(() => setIsBookmarkAnimating(false), 400);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: comments.length + 1,
      name: "You",
      username: "yourname",
      time: "now",
      content: newComment
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit(tweet);
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) onDelete(tweet.id);
  };

  return (
    <div className="group relative bg-gradient-to-br max-w-2xl from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-zinc-900/90 hover:to-zinc-950/90 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-zinc-950/50 hover:scale-[1.01]">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-700/0 to-zinc-600/0 group-hover:from-zinc-700/5 group-hover:to-zinc-600/5 transition-all duration-500 pointer-events-none"></div>
      
      {/* Liked indicator glow */}
      {liked && (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5 pointer-events-none animate-pulse"></div>
      )}

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img 
              src={tweet?.ownerInfo?.[0]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tweet?.ownerInfo?.[0]?.username || 'default'}`}
              alt={tweet?.ownerInfo?.[0]?.fullname || 'User avatar'}
              className="w-12 h-12 rounded-full flex-shrink-0 ring-2 ring-zinc-800/50 transition-all duration-300 group-hover:ring-zinc-700/50 group-hover:scale-110"
            />
            {/* Liked indicator pulse */}
            {liked && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center border-2 border-zinc-900 animate-pulse">
                <Heart className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-zinc-100 text-lg truncate transition-colors group-hover:text-zinc-50">{tweet ? tweet?.ownerInfo?.[0]?.fullname: "Abc"}</h3>
              {tweet.verified && (
                <Verified className="w-5 h-5 text-blue-400 flex-shrink-0 transition-transform group-hover:scale-110" fill="currentColor" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 truncate transition-colors group-hover:text-zinc-400">@{tweet ? tweet?.ownerInfo?.[0]?.username: "Abc"}</span>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-500 transition-colors group-hover:text-zinc-400">{tweet ? timeAgo(tweet.createdAt) : 0}</span>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50 p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 top-10 z-50 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit Tweet</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-400/10 transition-colors text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Delete Tweet</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tweet Content */}
        <div className="mb-5">
          <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-line transition-colors group-hover:text-zinc-200">
            {tweet.content}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-4 group-hover:via-zinc-700 transition-colors"></div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between relative">
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition-all duration-300 group/btn relative ${
              showComments ? 'text-blue-400' : 'text-zinc-500 hover:text-blue-400'
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              showComments ? 'bg-blue-400/10 scale-110' : 'group-hover/btn:bg-blue-400/10 group-hover/btn:scale-105'
            }`}>
              <MessageCircle className={`w-5 h-5 transition-transform duration-300 ${showComments ? 'rotate-12' : 'group-hover/btn:rotate-12'}`} />
            </div>
            <span className="text-sm font-medium">{tweet.replies + comments.length}</span>
          </button>

          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all duration-300 group/btn relative ${
              liked ? 'text-rose-400' : 'text-zinc-500 hover:text-rose-400'
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-300 relative ${
              liked ? 'bg-rose-400/10 scale-110' : 'group-hover/btn:bg-rose-400/10 group-hover/btn:scale-105'
            }`}>
              <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? 'fill-current scale-110' : ''} ${isLikeAnimating ? 'animate-ping' : ''} group-hover/btn:scale-125`} />
              {/* Heart burst effect */}
              {isLikeAnimating && (
                <>
                  <div className="absolute inset-0 animate-ping">
                    <Heart className="w-5 h-5 text-rose-400/50 fill-rose-400/50" />
                  </div>
                  <div className="absolute inset-0 animate-pulse">
                    <Heart className="w-5 h-5 text-pink-400/30 fill-pink-400/30 scale-150" />
                  </div>
                </>
              )}
            </div>
            <span className={`text-sm font-medium transition-all duration-300 ${isLikeAnimating ? 'scale-110' : ''}`}>{likes.toLocaleString()}</span>
          </button>

          <button 
            onClick={handleBookmark}
            className={`flex items-center gap-2 transition-all duration-300 group/btn ${
              bookmarked ? 'text-amber-400' : 'text-zinc-500 hover:text-amber-400'
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              bookmarked ? 'bg-amber-400/10 scale-110' : 'group-hover/btn:bg-amber-400/10 group-hover/btn:scale-105'
            }`}>
              <Bookmark className={`w-5 h-5 transition-all duration-300 ${bookmarked ? 'fill-current scale-110' : ''} ${isBookmarkAnimating ? 'scale-125 -rotate-12' : ''} group-hover/btn:scale-125 group-hover/btn:-rotate-12`} />
            </div>
          </button>

          <button className="flex items-center gap-2 text-zinc-500 hover:text-zinc-400 transition-all duration-300 group/btn">
            <div className="p-2 rounded-lg group-hover/btn:bg-zinc-800/50 transition-all duration-300 group-hover/btn:scale-105">
              <Share className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:rotate-12" />
            </div>
          </button>

          {/* Like animation overlay */}
          {isLikeAnimating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-ping opacity-50">
                <Heart className="w-16 h-16 text-rose-400/40 fill-rose-400/40" />
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-zinc-800/50 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-zinc-300 font-semibold text-sm">Comments</h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-zinc-500 hover:text-zinc-400 transition-all duration-200 hover:rotate-90 hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900/70 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    newComment.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <Send className={`w-5 h-5 transition-transform duration-200 ${newComment.trim() ? 'hover:translate-x-1' : ''}`} />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment, index) => (
                <div 
                  key={comment.id} 
                  className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4 hover:bg-zinc-900/50 hover:border-zinc-700/30 transition-all duration-300 animate-in slide-in-from-left fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                      alt={`${comment.name} avatar`}
                      className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-zinc-800/30 transition-all duration-300 hover:ring-zinc-700/50 hover:scale-110"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-zinc-300 font-medium text-sm">{comment.name}</span>
                        <span className="text-zinc-600 text-xs">@{comment.username}</span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-zinc-600 text-xs">{comment.time}</span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover gradient border effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-700/10 via-transparent to-zinc-600/10"></div>
      </div>
    </div>
  );
};

export default TweetComponent2;