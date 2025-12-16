import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import likeservice from '../../Service/like'

export default function LikeComment({ commentId, userId , isLiked, totalLikes}) {
  const [likes, setLikes] = useState(totalLikes);
  const [liked, setLiked] = useState(isLiked);

  const handleLike = () => {
    if (!userId) return alert("Login to like comments");
    likeservice.likeComment({id:commentId}).then((res) =>{
      console.log(res)
    })
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    console.log(`Comment ${commentId} liked by ${userId}`);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-1 text-xs sm:text-sm px-2 py-1 rounded-full transition-all 
        ${liked ? "text-blue-400 bg-blue-500/10" : "text-gray-400 hover:text-white hover:bg-gray-700/40"}
      `}
    >
      <ThumbsUp size={15} />
      <span>{likes}</span>
    </button>
  );
}
