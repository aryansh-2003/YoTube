import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Trash2,
  X
} from "lucide-react";
import commentService from "../../Service/comment";
import DisplayPic from "../components/DisplayPic";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {timeAgo} from './TimeResolver'

export default function CommentsSection({ onAddComment, video }) {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState("top");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState([]);
  const { handleSubmit, register, formState: { errors } } = useForm();
  const userData = useSelector(state => state?.auth?.userData)

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    if (!video) return;
    commentService.getComment({ videoId: video._id }).then((res) => {
      setComments(res?.data?.data || []);
    });
  }, [video, comments]);

  const onSubmit = (data) => {
    commentService.addComment(video._id, data?.content).then((res) => {
      if (res.status === 200) {
        console.log(res?.data?.data)
        setComments((prev) => [res?.data?.data,...prev]);
        // setNewComment("");
        setShowCommentInput(false);
      }
    });
  };

  const handleEditSubmit = () => {
    if (!editingComment) return;
     commentService.updateComment({commentId: editingComment._id, content : editingComment.content}).then((res) => {
      if (res.status === 200) {
        console.log(res)
        setComments((prev) =>
          prev.map((c) =>
            c._id === res?.data?.data?._id ? { ...c, content: res?.data?.data?.content } : c
          )
        );
        setEditingComment(null);
        setEditedContent("");
      }
    });
  };

  const handleDelete = (id) => {
    commentService.deleteComment({commentId:id}).then((res) => {
      console.log(res)
      if (res.status === 200) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    });
  };

  return (
    <div className="text-white space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-lg sm:text-xl font-semibold">
          {comments?.length || 0} Comments
        </h3>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-white outline-none"
          >
            <option value="top" className="bg-gray-900">
              Top comments
            </option>
            <option value="newest" className="bg-gray-900">
              Newest first
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <img
            src={userData ? userData?.avatar : ""}
            alt="Your avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                onFocus={() => setShowCommentInput(true)}
                {...register("content", { required: "Comment cannot be empty" })}
                placeholder="Add a comment..."
                className="w-full bg-transparent border-b border-gray-600 pb-2 focus:border-white outline-none text-sm sm:text-base"
              />
              {errors.content && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
              {(showCommentInput || newComment) && (
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewComment("");
                      setShowCommentInput(false);
                    }}
                    className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-full transition-colors"
                  >
                    Comment
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment._id} className="space-y-3 relative group">
            <div className="flex space-x-3">
              <DisplayPic className="mb-8" children={comment?.ownerInfo?.[0]} />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <span className="font-medium text-sm">
                        {comment?.ownerInfo?.[0]?.fullname}
                      </span>
                      <span className="text-xs text-gray-400">
                        {comment ? timeAgo(comment?.createdAt) : ""}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mt-1">
                      {comment.content}
                    </p>
                  </div>

                  {/* Three Dot Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setMenuOpenId(menuOpenId === comment._id ? null : comment._id)
                      }
                      className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {userData?._id === comment?.owner && 
                    <>
                    {menuOpenId === comment._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setEditingComment(comment);
                            setEditedContent(comment.content);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-800 transition-colors"
                        >
                          <Edit3 size={16} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-800 transition-colors text-red-400"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                    </>
                    }
                  </div>
                </div>

                {/* Like / Dislike / Reply */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-xs hover:bg-gray-800 px-2 py-1 rounded-full transition-colors">
                    <ThumbsUp size={14} />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-xs hover:bg-gray-800 px-2 py-1 rounded-full transition-colors">
                    <ThumbsDown size={14} />
                  </button>
                  <button className="text-xs font-medium hover:bg-gray-800 px-2 py-1 rounded-full transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Comment Dialog */}
      {editingComment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4 relative">
            <button
              onClick={() => setEditingComment(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold">Edit Comment</h2>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              className="w-full bg-transparent border border-gray-700 rounded-lg p-3 focus:border-white outline-none text-sm resize-none"
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setEditingComment(null)}
                className="px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-medium transition-colors"
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
