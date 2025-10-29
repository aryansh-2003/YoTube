import { useEffect, useState, useRef } from "react";
import subscriptionService from "../../Service/subscription";
import { Bell } from "lucide-react";

export default function SubscribeButton({ isSubscribed, id }) {
  const [Subscribed, setIsSubscribed] = useState(isSubscribed);
  const [particles, setParticles] = useState([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isSubscribed) setIsSubscribed(isSubscribed);
  }, [isSubscribed]);

  const createParticles = (isSubscribe) => {
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
        isSubscribe,
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  const handleSubscribe = async () => {
    const next = !Subscribed;
    setIsSubscribed(next);
    createParticles(next);
    subscriptionService.subscribeto({ subscribetoid: id }).then(() => {});
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleSubscribe}
        aria-pressed={Subscribed}
        aria-label={Subscribed ? "Unsubscribe" : "Subscribe"}
        className={`relative z-30 flex items-center gap-2.5 px-4 py-2 rounded-lg font-medium border backdrop-blur-sm ${
          Subscribed
            ? "bg-white/5 text-white border-white/10"
            : "bg-white/[0.02] text-white/70 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10"
        }`}
      >
        {/* Bell Icon */}
        <Bell
          className={`w-5 h-5 ${
            Subscribed ? "stroke-white" : "stroke-current"
          }`}
          strokeWidth="1.5"
        />

        {/* Text */}
        <span className="text-sm">
          {Subscribed ? "Subscribed" : "Subscribe"}
        </span>

        {/* Status Indicator */}
        <span
          className={`text-sm px-2 py-0.5 rounded ${
            Subscribed
              ? "bg-white/10 text-white"
              : "bg-white/5 text-white/60"
          }`}
        >
          {Subscribed ? "✓" : "+"}
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
              backgroundColor: particle.isSubscribe ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
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