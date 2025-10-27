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
    const particleCount = 80;
    const animeIcons = [
      "🌸", "🌺", "💮", "🏵️", // Sakura and flower petals
      "❤️", "💖", "💕", "💗", // Hearts
      "⚡", "✨", "💫", "⭐", // Energy and stars
      "🔥", "🎌", "🎋", // Fire and Japanese elements
      "🗡️", "⚔️", "🥷" // Weapons and ninja
    ];
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      // Random position across entire viewport
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      
      return {
        id: `${Date.now()}-${i}`,
        x: startX,
        y: startY,
        emoji: animeIcons[Math.floor(Math.random() * animeIcons.length)],
        angle: Math.random() * 2 * Math.PI,
        distance: 100 + Math.random() * 200,
        size: 20 + Math.random() * 30,
        duration: 2000 + Math.random() * 1000,
        delay: Math.random() * 300,
        rotation: Math.random() * 720 - 360,
        floatDirection: Math.random() > 0.5 ? 1 : -1,
      };
    });

    setHeartBursts(newParticles);
    setTimeout(() => setHeartBursts([]), 3500);
  };

  const fireBrokenHeartBurst = () => {
    const particleCount = 70;
    const sadIcons = [
      "💔", "😢", "😭", "💨", // Broken hearts and tears
      "🌑", "⚫", "💀", // Dark elements
      "🌪️", "💧", "🥀", // Wilted and sad
      "😞", "😔", "🖤", // More sad emojis
      "⛈️", "🌧️" // Storm elements
    ];
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      // Random position across entire viewport
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      
      return {
        id: `${Date.now()}-${i}`,
        x: startX,
        y: startY,
        emoji: sadIcons[Math.floor(Math.random() * sadIcons.length)],
        angle: Math.random() * 2 * Math.PI,
        distance: 80 + Math.random() * 180,
        size: 18 + Math.random() * 25,
        duration: 2200 + Math.random() * 800,
        delay: Math.random() * 250,
        rotation: Math.random() * -720,
        floatDirection: Math.random() > 0.5 ? 1 : -1,
      };
    });

    setHeartBursts(newParticles);
    setTimeout(() => setHeartBursts([]), 3500);
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
      {/* Button with anime styling */}
      <button
        ref={buttonRef}
        onClick={handleLike}
        aria-pressed={isLiked}
        aria-label={isLiked ? "Unlike" : "Like"}
        className={`relative z-30 flex items-center gap-3 px-5 py-2.5 rounded-full font-bold transition-all duration-300 transform active:scale-95 border-2 overflow-hidden group ${
          isLiked
            ? "bg-gradient-to-r from-red-600 via-pink-600 to-red-600 text-white border-amber-400/50 shadow-lg shadow-red-500/50"
            : "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-amber-100 border-amber-400/30 hover:border-amber-400/60 shadow-lg"
        }`}
        style={isLiked ? { 
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(251, 191, 36, 0.1)'
        } : {}}
      >
        {/* Animated background effect */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isLiked 
            ? 'bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 opacity-100 animate-pulse' 
            : 'bg-gradient-to-r from-orange-500/0 via-amber-400/10 to-orange-500/0 opacity-0 group-hover:opacity-100'
        }`}></div>

        {/* Glowing orb effect on liked state */}
        {isLiked && (
          <>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-full opacity-60 blur-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 animate-pulse"></div>
          </>
        )}

        {/* Heart Icon */}
        <svg
          className={`w-6 h-6 transition-all duration-300 relative z-10 ${
            isLiked 
              ? "fill-amber-300 scale-125 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" 
              : "fill-none stroke-current group-hover:scale-110"
          }`}
          strokeWidth="2.5"
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
        <span className={`text-sm font-bold relative z-10 ${
          isLiked ? 'text-amber-100' : 'text-amber-200'
        }`} style={isLiked ? { textShadow: '0 0 10px rgba(251, 191, 36, 0.5)' } : {}}>
          Like
        </span>

        {/* Like Count Badge */}
        <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full relative z-10 transition-all duration-300 ${
          isLiked
            ? 'bg-amber-400 text-red-900 shadow-lg shadow-amber-400/50'
            : 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
        }`}>
          {likes}
        </span>

        {/* Shimmer effect */}
        {!isLiked && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
        )}
      </button>

      {/* Particle burst container - FULL PAGE */}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        {heartBursts.map((particle) => (
          <span
            key={particle.id}
            className="absolute anime-burst"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              fontSize: `${particle.size}px`,
              transform: "translate(-50%, -50%)",
              filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.7)) drop-shadow(0 0 12px rgba(251, 191, 36, 0.3))',
              "--angle": `${particle.angle}rad`,
              "--distance": `${particle.distance}px`,
              "--duration": `${particle.duration}ms`,
              "--delay": `${particle.delay}ms`,
              "--rotation": `${particle.rotation}deg`,
              "--float-dir": particle.floatDirection,
            }}
          >
            {particle.emoji}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes animeBurst {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -50%)
              translate(
                calc(cos(var(--angle)) * var(--distance) * 0.4),
                calc(sin(var(--angle)) * var(--distance) * 0.4 + calc(var(--float-dir) * -30px))
              )
              scale(1.2) rotate(calc(var(--rotation) * 0.3));
            opacity: 1;
          }
          60% {
            transform: translate(-50%, -50%)
              translate(
                calc(cos(var(--angle)) * var(--distance) * 0.8),
                calc(sin(var(--angle)) * var(--distance) * 0.8 + calc(var(--float-dir) * -60px))
              )
              scale(1.1) rotate(calc(var(--rotation) * 0.7));
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%)
              translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance) + calc(var(--float-dir) * -100px))
              )
              scale(0.8) rotate(var(--rotation));
            opacity: 0;
          }
        }

        .anime-burst {
          animation: animeBurst var(--duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: var(--delay);
          pointer-events: none;
          will-change: transform, opacity;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        /* Additional sparkle effect for liked state */
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}