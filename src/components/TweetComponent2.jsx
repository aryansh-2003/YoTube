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
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    likeservice.likeTweet(tweet?._id).then((res) => {
      console.log(res)
    })
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
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
    <div className="bg-gradient-to-br max-w-2xl  from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gradient-to-br hover:from-zinc-900/90 hover:to-zinc-950/90 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-zinc-950/50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <img 
            src={tweet?.ownerInfo?.[0]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tweet?.ownerInfo?.[0]?.username || 'default'}`}
            alt={tweet?.ownerInfo?.[0]?.fullname || 'User avatar'}
            className="w-12 h-12 rounded-full flex-shrink-0 ring-2 ring-zinc-800/50"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-zinc-100 text-lg truncate">{tweet ? tweet?.ownerInfo?.[0]?.fullname: "Abc"}</h3>
              {tweet.verified && (
                <Verified className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 truncate">@{tweet ? tweet?.ownerInfo?.[0]?.username: "Abc"}</span>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-500">{tweet ? timeAgo(tweet.createdAt) : 0}</span>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50 p-2 rounded-lg transition-all duration-200"
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
                <div className="absolute right-0 top-10 z-50 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
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
          <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-line">
            {tweet.content}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-4"></div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition-all duration-200 group ${
              showComments ? 'text-blue-400' : 'text-zinc-500 hover:text-blue-400'
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors ${
              showComments ? 'bg-blue-400/10' : 'group-hover:bg-blue-400/10'
            }`}>
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">{tweet.replies + comments.length}</span>
          </button>

          {/* <button 
            onClick={handleRetweet}
            className={`flex items-center gap-2 transition-all duration-200 group ${
              retweeted ? 'text-emerald-400' : 'text-zinc-500 hover:text-emerald-400'
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              retweeted ? 'bg-emerald-400/10 rotate-180' : 'group-hover:bg-emerald-400/10'
            }`}>
              <Repeat2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">{retweets}</span>
          </button> */}

          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all duration-200 group ${
              liked ? 'text-rose-400' : 'text-zinc-500 hover:text-rose-400'
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              liked ? 'bg-rose-400/10 scale-110' : 'group-hover:bg-rose-400/10'
            }`}>
              <Heart className={`w-5 h-5 transition-all duration-200 ${liked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-sm font-medium">{likes.toLocaleString()}</span>
          </button>

          <button 
            onClick={handleBookmark}
            className={`flex items-center gap-2 transition-all duration-200 group ${
              bookmarked ? 'text-amber-400' : 'text-zinc-500 hover:text-amber-400'
            }`}
          >
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              bookmarked ? 'bg-amber-400/10' : 'group-hover:bg-amber-400/10'
            }`}>
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </div>
          </button>

          <button className="flex items-center gap-2 text-zinc-500 hover:text-zinc-400 transition-all duration-200 group">
            <div className="p-2 rounded-lg group-hover:bg-zinc-800/50 transition-colors">
              <Share className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-zinc-300 font-semibold text-sm">Comments</h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-zinc-500 hover:text-zinc-400 transition-colors"
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
                  className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    newComment.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`}
                      alt={`${comment.name} avatar`}
                      className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-zinc-800/30"
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
    </div>
  );
};

export default TweetComponent2;