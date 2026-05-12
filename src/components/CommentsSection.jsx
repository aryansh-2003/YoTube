import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  AlignLeft,
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
    <div className="text-slate-900 w-full max-w-[1280px] mx-auto font-sans">
      
      {/* Header: Count and Sort */}
      <div className="flex items-center gap-6 mb-6">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {comments?.length || 0} Comments
        </h3>
        
        <div className="relative group cursor-pointer flex items-center gap-2">
           <AlignLeft className="w-5 h-5 text-slate-700" />
           <span className="text-sm font-bold text-slate-700">Sort by</span>
           
           <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          >
            <option value="top">Top comments</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      </div>

      {/* Add Comment Input Section */}
      <div className="flex gap-4 mb-8">
        <div className="flex-shrink-0 mt-1">
          <img
            src={userData ? userData?.avatar : defaultAvatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <input
              type="text"
              onFocus={() => setShowCommentInput(true)}
              {...register("content", { required: "Comment cannot be empty" })}
              placeholder="Add a comment..."
              autoComplete="off"
              className="w-full bg-transparent border-b border-slate-300 pb-2 focus:border-[#ff0000] focus:border-b-2 outline-none text-[15px] text-slate-900 placeholder-slate-500 transition-colors"
            />
            {errors.content && (
              <p className="text-[#ff0000] text-xs mt-1 font-medium">{errors.content.message}</p>
            )}
            
            {showCommentInput && (
              <div className="flex justify-between items-center mt-3">
                 <div className="text-slate-400 text-lg hover:text-slate-600 cursor-pointer transition-colors">☺</div>
                 <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewComment("");
                        setShowCommentInput(false);
                      }}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-500 hover:bg-[#ff0000] hover:text-white rounded-full transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm"
                    >
                      Comment
                    </button>
                 </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment._id} className="group relative flex gap-4">
            
            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
              <DisplayPic 
                 className="w-10 h-10 rounded-full object-cover cursor-pointer border border-slate-200 hover:shadow-sm transition-shadow" 
                 children={comment?.ownerInfo?.[0]} 
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Metadata Row */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-bold text-slate-900 cursor-pointer hover:text-[#ff0000] transition-colors">
                  @{comment?.ownerInfo?.[0]?.fullname?.replace(/\s+/g, '') || "User"}
                </span>
                <span className="text-[12px] text-slate-500 font-medium">
                  {comment ? timeAgo(comment?.createdAt) : ""}
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-[14px] leading-relaxed text-slate-800 whitespace-pre-wrap mb-2">
                {comment.content}
              </p>

              {/* Actions Row */}
              <div className="flex items-center gap-1">
                <div className="scale-90 transform origin-left">
                  <LikeComment 
                    commentId={comment._id} 
                    userId={userData?._id} 
                    isLiked={comment ? comment.isLiked : ""} 
                    totalLikes={comment ? comment.totalLikes : ""} 
                  />
                </div>
                
                <button className="px-3 py-1.5 rounded-full text-[12px] font-bold text-slate-600 hover:bg-slate-100 transition-colors ml-1">
                  Reply
                </button>
              </div>
            </div>

            {/* Options Menu (Three Dots) - Visible on Hover */}
            {userData?._id === comment?.owner && (
              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    setMenuOpenId(
                      menuOpenId === comment._id ? null : comment._id
                    )
                  }
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {/* Dropdown Menu */}
                {menuOpenId === comment._id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] py-2 z-20 border border-slate-100">
                    <button
                      onClick={() => {
                        setEditingComment(comment);
                        setEditedContent(comment.content);
                        setMenuOpenId(null);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#ff0000] transition-colors gap-3"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="flex items-center w-full px-4 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#ff0000] transition-colors gap-3"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Comment Modal */}
      {editingComment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[600px] rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Edit comment</h2>
              <button
                onClick={() => setEditingComment(null)}
                className="text-slate-400 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-4 outline-none focus:border-[#ff0000] focus:ring-2 focus:ring-[#ff0000]/10 text-[15px] resize-none mb-4 transition-all shadow-inner"
              placeholder="Edit your comment..."
            />
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingComment(null)}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#ff0000] text-white hover:bg-[#dd0000] transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}