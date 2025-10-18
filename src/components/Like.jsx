import { useState, useEffect, useRef } from "react";
import likeService from '../../Service/like';

export default function LikeButton({ liked, videoId, totalLikes, videoInfo }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(totalLikes || 0);
  const [heartBursts, setHeartBursts] = useState([]);
  const buttonRef = useRef(null);
  useEffect(() => {
    if (!videoInfo) return;
    setIsLiked(videoInfo.isLiked);
    setLikes(videoInfo.totalLikes);
  }, [videoInfo]);

  const fireHeartBurst = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const centerX = buttonRect
      ? buttonRect.left + buttonRect.width / 2
      : window.innerWidth / 2;
    const centerY = buttonRect
      ? buttonRect.top + buttonRect.height / 2
      : window.innerHeight / 2;

    const particleCount = 50;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      x: centerX,
      y: centerY,
      emoji: Math.random() > 0.3 ? "❤️" : "💖",
      angle: Math.random() * 2 * Math.PI,
      distance: 100 + Math.random() * 300,
      size: 20 + Math.random() * 20,
      duration: 1500 + Math.random() * 500,
    }));

    setHeartBursts(newParticles);
    setTimeout(() => setHeartBursts([]), 2000);
  };

  const fireBrokenHeartBurst = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const centerX = buttonRect
      ? buttonRect.left + buttonRect.width / 2
      : window.innerWidth / 2;
    const centerY = buttonRect
      ? buttonRect.top + buttonRect.height / 2
      : window.innerHeight / 2;

    const particleCount = 45;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      x: centerX,
      y: centerY,
      emoji: Math.random() > 0.4 ? "💔" : "😢",
      angle: Math.random() * 2 * Math.PI,
      distance: 80 + Math.random() * 280,
      size: 20 + Math.random() * 18,
      duration: 1600 + Math.random() * 400,
    }));

    setHeartBursts(newParticles);
    setTimeout(() => setHeartBursts([]), 2000);
  };

  const handleLike = async () => {
    if (!videoInfo) return;
    const currentlyLiked = isLiked;
    try {
      const res = await likeService.likeVideo({ videoId: videoInfo._id });
      if (res.status === 200 || res.status === 201) {
        setIsLiked(!currentlyLiked);
        if (!currentlyLiked) {
          fireHeartBurst();
          setLikes(prev => prev + 1);
        } else {
          fireBrokenHeartBurst();
          setLikes(prev => (prev > 0 ? prev - 1 : 0));
        }
      } else {
        console.warn("Unexpected status:", res.status);
      }
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleLike}
        aria-pressed={isLiked}
        aria-label={isLiked ? "Unlike" : "Like"}
        className={`relative z-30 flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all transform active:scale-90 ${
          isLiked
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <svg
          className={`w-6 h-6 transition-all ${
            isLiked ? "fill-red-600 scale-110" : "fill-none stroke-current"
          }`}
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span className="text-sm">Like</span>
        <span className="text-sm">{likes}</span>
      </button>

      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {heartBursts.map((particle) => (
          <span
            key={particle.id}
            className="absolute heart-burst"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              fontSize: `${particle.size}px`,
              transform: "translate(-50%, -50%)",
              "--angle": `${particle.angle}rad`,
              "--distance": `${particle.distance}px`,
              "--duration": `${particle.duration}ms`,
            }}
          >
            {particle.emoji}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes heartBurst {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%)
              translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
              )
              scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }

        .heart-burst {
          animation: heartBurst var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }
      `}</style>
    </div>
  );
}
