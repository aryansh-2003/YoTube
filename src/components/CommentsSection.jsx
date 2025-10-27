import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import commentService from "../../Service/comment";
import DisplayPic from "../components/DisplayPic";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { timeAgo } from "./TimeResolver";
import LikeComment from "./LikeComment";
import defaultAvatar from "../assets/download.jpeg";

export default function CommentsSection({ onAddComment, video }) {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState("top");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const { handleSubmit, register, formState: { errors } } = useForm();
  const userData = useSelector((state) => state?.auth?.userData);

  useEffect(() => {
    if (!video) return;
    commentService.getComment({ videoId: video._id }).then((res) => {
      setComments(res?.data?.data || []);
    });
  }, [video]);

  const onSubmit = (data) => {
    commentService.addComment(video._id, data?.content).then((res) => {
      if (res.status === 200) {
        const newCommentObj = {
          ...res?.data?.data,
          ownerInfo: [
            {
              fullname: userData?.fullname,
              avatar: userData?.avatar,
              _id: userData?._id,
            },
          ],
        };
        setComments((prev) => [newCommentObj, ...prev]);
        setShowCommentInput(false);
      }
    });
  };

  const handleEditSubmit = () => {
    if (!editingComment) return;
    commentService
      .updateComment({
        commentId: editingComment._id,
        content: editedContent,
      })
      .then((res) => {
        if (res.status === 200) {
          setComments((prev) =>
            prev.map((c) =>
              c._id === res?.data?.data?._id
                ? { ...c, content: res?.data?.data?.content }
                : c
            )
          );
          setEditingComment(null);
          setEditedContent("");
        }
      });
  };

  const handleDelete = (id) => {
    commentService.deleteComment({ commentId: id }).then((res) => {
      if (res.status === 200) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    });
  };

  return (
    <div className="text-white space-y-4 relative">
      {/* Anime character decorations - floating */}
      <div className="fixed top-20 right-4 w-16 h-16 opacity-20 pointer-events-none z-0">
        <div className="text-6xl animate-bounce">🍥</div>
      </div>
      <div className="fixed bottom-32 left-4 w-16 h-16 opacity-20 pointer-events-none z-0">
        <div className="text-6xl" style={{ animation: 'float 3s ease-in-out infinite' }}>⚔️</div>
      </div>
      <div className="fixed top-1/3 right-8 w-12 h-12 opacity-15 pointer-events-none z-0">
        <div className="text-5xl" style={{ animation: 'float 4s ease-in-out infinite 1s' }}>🔥</div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-md border border-orange-500/30 shadow-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-orange-400" strokeWidth={2.5} />
          <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            {comments?.length || 0} Comments
          </h3>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mt-2 sm:mt-0 bg-slate-800/80 border border-orange-500/30 text-orange-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-400 transition-all"
        >
          <option value="top" className="bg-slate-900">⚡ Top</option>
          <option value="newest" className="bg-slate-900">🔥 Newest</option>
        </select>
      </div>

      {/* Add Comment Box */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
        <div className="relative flex space-x-2 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-orange-500/30 shadow-lg">
          <div className="relative">
            <img
              src={userData ? userData?.avatar : defaultAvatar}
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border border-slate-900"></div>
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                onFocus={() => setShowCommentInput(true)}
                {...register("content", { required: "Comment cannot be empty" })}
                placeholder="Share your thoughts..."
                className="w-full bg-transparent border-b border-orange-500/30 pb-2 focus:border-orange-400 outline-none text-sm placeholder-slate-500 transition-all"
              />
              {errors.content && (
                <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>
              )}
              {showCommentInput && (
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewComment("");
                      setShowCommentInput(false);
                    }}
                    className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-lg transition-all shadow-md shadow-orange-500/30"
                  >
                    Post
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Comments List - All in one container */}
      <div className="relative bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
        {/* Naruto-style header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
        
        <div className="divide-y divide-slate-700/30">
          {comments?.map((comment, index) => (
            <div
              key={comment._id}
              className="relative group hover:bg-slate-800/30 transition-all p-3"
            >
              {/* Subtle side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
              
              <div className="flex space-x-2.5">
                <div className="relative flex-shrink-0">
                  <DisplayPic className="ring-2 ring-blue-500/20" children={comment?.ownerInfo?.[0]} />
                  {index % 3 === 0 && <div className="absolute -bottom-1 -right-1 text-xs">🍥</div>}
                  {index % 3 === 1 && <div className="absolute -bottom-1 -right-1 text-xs">⚡</div>}
                  {index % 3 === 2 && <div className="absolute -bottom-1 -right-1 text-xs">🔥</div>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {comment?.ownerInfo?.[0]?.fullname}
                        </span>
                        <span className="text-xs text-slate-500">
                          {comment ? timeAgo(comment?.createdAt) : ""}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-200">
                        {comment.content}
                      </p>
                    </div>

                    {/* Options Menu */}
                    {userData?._id === comment?.owner && (
                      <div className="relative ml-2 flex-shrink-0">
                        <button
                          onClick={() =>
                            setMenuOpenId(
                              menuOpenId === comment._id ? null : comment._id
                            )
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal size={14} className="text-slate-400" />
                        </button>
                        {menuOpenId === comment._id && (
                          <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-orange-500/30 rounded-lg shadow-xl z-10 overflow-hidden">
                            <button
                              onClick={() => {
                                setEditingComment(comment);
                                setEditedContent(comment.content);
                                setMenuOpenId(null);
                              }}
                              className="flex items-center w-full px-3 py-2 text-xs text-blue-300 hover:bg-slate-800 transition-colors"
                            >
                              <Edit3 size={12} className="mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(comment._id)}
                              className="flex items-center w-full px-3 py-2 text-xs text-red-400 hover:bg-slate-800 transition-colors"
                            >
                              <Trash2 size={12} className="mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Like Component */}
                  <div className="mt-2">
                    <LikeComment commentId={comment._id} userId={userData?._id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Comment Modal */}
      {editingComment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
            
            <div className="relative bg-slate-900 p-5 rounded-2xl border border-orange-500/40 shadow-2xl">
              <button
                onClick={() => setEditingComment(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
              >
                <X size={16} />
              </button>
              
              <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                <Edit3 className="mr-2 text-orange-400" size={18} />
                Edit Comment
              </h2>
              
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-800/50 border border-orange-500/30 focus:border-orange-400 rounded-xl p-3 outline-none text-sm resize-none transition-all"
                placeholder="Write your updated comment..."
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg shadow-orange-500/30"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}