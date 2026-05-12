import { useState, useEffect, useRef } from "react";
import likeService from '../../Service/like';

export default function LikeButton({ liked, videoId, totalLikes, videoInfo }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(totalLikes || 0);
  const [particles, setParticles] = useState([]);
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (!videoInfo) return;
    setIsLiked(videoInfo.isLiked);
    setLikes(videoInfo.totalLikes);
  }, [videoInfo]);

  const createParticles = (isLiking) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const particleCount = 12;
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 60 + Math.random() * 40;
      const size = 3 + Math.random() * 3;
      
      return {
        id: `${Date.now()}-${i}`,
        x: centerX,
        y: centerY,
        targetX: centerX + Math.cos(angle) * distance,
        targetY: centerY + Math.sin(angle) * distance,
        size,
        duration: 800 + Math.random() * 400,
        delay: Math.random() * 100,
        isLiking,
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  const handleLike = async () => {
    if (!videoInfo) return;
    const currentlyLiked = isLiked;
    try {
      const res = await likeService.likeVideo({ videoId: videoInfo._id });
      if (res.status === 200 || res.status === 201) {
        setIsLiked(!currentlyLiked);
        if (!currentlyLiked) {
          createParticles(true);
          setLikes(prev => prev + 1);
        } else {
          createParticles(false);
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
        className={`relative z-30 flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-sm border ${
          isLiked
            ? "bg-red-50 text-[#ff0000] border-red-100 hover:bg-red-100"
            : "bg-slate-100 text-slate-700 border-slate-200/50 hover:bg-slate-200 hover:text-slate-900"
        }`}
      >
        {/* Heart Icon */}
        <svg
          className={`w-4 h-4 transition-colors ${
            isLiked 
              ? "fill-[#ff0000] text-[#ff0000]" 
              : "fill-none stroke-current"
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

        {/* Like Text */}
        <span className="text-sm">
          Like
        </span>

        {/* Like Count */}
        <span className={`text-sm ml-1 px-2 py-0.5 rounded-md ${
          isLiked
            ? 'bg-red-100 text-[#ff0000]'
            : 'bg-slate-200/50 text-slate-600'
        }`}>
          {likes}
        </span>
      </button>

      {/* Particle system */}
      <div className="pointer-events-none fixed inset-0 z-[9999]">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full particle-fade"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.isLiking ? '#ff0000' : '#94a3b8',
              "--target-x": `${particle.targetX - particle.x}px`,
              "--target-y": `${particle.targetY - particle.y}px`,
              "--duration": `${particle.duration}ms`,
              "--delay": `${particle.delay}ms`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes particleFade {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--target-x), var(--target-y)) scale(1);
            opacity: 0;
          }
        }

        .particle-fade {
          animation: particleFade var(--duration) ease-out forwards;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}