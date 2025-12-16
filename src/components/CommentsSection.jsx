import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  AlignLeft, // Used for Sort icon style
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
    <div className="text-white w-full max-w-[1280px] mx-auto font-sans">
      
      {/* Header: Count and Sort */}
      <div className="flex items-center gap-8 mb-6">
        <h3 className="text-xl font-bold text-white">
          {comments?.length || 0} Comments
        </h3>
        
        <div className="relative group cursor-pointer flex items-center gap-2">
           <AlignLeft className="w-5 h-5 text-white" />
           <span className="text-sm font-semibold text-white">Sort by</span>
           
           {/* Invisible Select overlaying the Sort By text to keep logic same but design clean */}
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
        <div className="flex-shrink-0">
          <img
            src={userData ? userData?.avatar : defaultAvatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
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
              className="w-full bg-transparent border-b border-[#3f3f3f] pb-2 focus:border-white focus:border-b-2 outline-none text-[15px] placeholder-gray-400 transition-colors"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
            )}
            
            {showCommentInput && (
              <div className="flex justify-between items-center mt-3">
                 <div className="text-gray-400 text-lg">☺</div> {/* Emoji placeholder */}
                 <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNewComment("");
                        setShowCommentInput(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white hover:bg-[#3f3f3f] rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium bg-[#3ea6ff] text-black hover:bg-[#65b8ff] rounded-full transition-colors disabled:bg-[#202020] disabled:text-gray-500"
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
            <div className="flex-shrink-0">
              <DisplayPic 
                 className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90" 
                 children={comment?.ownerInfo?.[0]} 
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Metadata Row */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold text-white cursor-pointer hover:underline">
                  @{comment?.ownerInfo?.[0]?.fullname?.replace(/\s+/g, '') || "User"}
                </span>
                <span className="text-[12px] text-gray-400">
                  {comment ? timeAgo(comment?.createdAt) : ""}
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-[14px] leading-5 text-white whitespace-pre-wrap mb-2">
                {comment.content}
              </p>

              {/* Actions Row (Like, Reply, Edit menu) */}
              <div className="flex items-center gap-2">
                <LikeComment 
                  commentId={comment._id} 
                  userId={userData?._id} 
                  isLiked={comment ? comment.isLiked : ""} 
                  totalLikes={comment ? comment.totalLikes : ""} 
                />
                
                <button className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-white hover:bg-[#3f3f3f] transition-colors ml-2">
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
                  className="p-2 rounded-full hover:bg-[#3f3f3f] text-white"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {/* Dropdown Menu */}
                {menuOpenId === comment._id && (
                  <div className="absolute right-0 mt-2 w-36 bg-[#282828] rounded-xl shadow-xl py-2 z-20 ring-1 ring-white/10">
                    <button
                      onClick={() => {
                        setEditingComment(comment);
                        setEditedContent(comment.content);
                        setMenuOpenId(null);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-[14px] text-gray-200 hover:bg-[#3f3f3f] transition-colors gap-3"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="flex items-center w-full px-4 py-2.5 text-[14px] text-gray-200 hover:bg-[#3f3f3f] transition-colors gap-3"
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#212121] w-full max-w-[600px] rounded-2xl p-6 shadow-2xl ring-1 ring-white/10 relative">
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Edit comment</h2>
              <button
                onClick={() => setEditingComment(null)}
                className="text-gray-400 hover:bg-[#3f3f3f] p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              className="w-full bg-[#0f0f0f] border border-[#3f3f3f] text-white rounded-lg p-3 outline-none focus:border-[#3ea6ff] text-[15px] resize-none mb-4"
              placeholder="Edit your comment..."
            />
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingComment(null)}
                className="px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-[#3f3f3f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-5 py-2 rounded-full text-sm font-medium bg-[#3ea6ff] text-black hover:bg-[#65b8ff] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}