import { useEffect, useState } from "react";
import subscriptionService from "../../Service/subscription";

export default function SubscribeButton({ isSubscribed, id }) {
  const [Subscribed, setIsSubscribed] = useState(isSubscribed);

  useEffect(() => {
    if(!isSubscribed) return
    setIsSubscribed(isSubscribed)
  },[isSubscribed])

  const [sadBursts, setSadBursts] = useState([]);

  const fireConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;

    const duration = 1800;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 35,
      ticks: 400,
      zIndex: 2000,
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = Math.floor(60 * (timeLeft / duration)) + 10;
      confetti({
        ...defaults,
        particleCount,
        spread: 120,
        origin: { x: Math.random(), y: Math.random() * 0.6 },
      });
    }, 220);

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 300,
        spread: 170,
        origin: { x: 0.5, y: 0.35 },
      });
    }, duration - 220);
  };

  // Sad emojis explosion (exact same behavior as fireworks but with emojis)
  const fireSadBlast = () => {
    const particleCount = 40;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      emoji: Math.random() > 0.5 ? "😢" : "💧",
      angle: Math.random() * 2 * Math.PI,
      distance: 100 + Math.random() * 250,
      size: 24 + Math.random() * 16,
    }));

    setSadBursts(newParticles);

    setTimeout(() => {
      setSadBursts([]);
    }, 1800);
  };

  const handleSubscribe = async () => {
    const next = !Subscribed;
    setIsSubscribed(next);
    if (next) {
      fireConfetti();
    } else {
      fireSadBlast();
    }
    subscriptionService.subscribeto({ subscribetoid: id }).then((res) => {});
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleSubscribe}
        aria-pressed={Subscribed}
        className={`relative z-30 px-6 py-2 rounded-full font-semibold transition-transform transform active:scale-95 shadow-lg flex items-center gap-2 ${
          Subscribed
            ? "bg-gray-200 text-black hover:bg-gray-300"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {Subscribed ? "Subscribed" : "Subscribe"}
      </button>

      {/* Full-screen emoji explosion */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {sadBursts.map((particle) => (
          <span
            key={particle.id}
            className="absolute text-2xl sad-blast"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              fontSize: `${particle.size}px`,
              transform: `translate(-50%, -50%)`,
              "--angle": particle.angle,
              "--distance": `${particle.distance}px`,
            }}
          >
            {particle.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
