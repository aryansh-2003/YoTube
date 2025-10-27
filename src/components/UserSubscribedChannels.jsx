import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import subscriptionService from "../../Service/subscription";

export default function UserSubscribedChannels({ userId }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await subscriptionService.getUserSubscription();
        if (res?.status === 200 || res?.status === 201) {
          if (mounted) setSubscriptions(res?.data?.data || []);
        }
      } catch (err) {
        console.error("Subscription fetch failed:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-orange-500 border-r-pink-500"></div>
        </div>
      </div>
    );

  if (!subscriptions?.length)
    return (
      <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md border-2 border-orange-500/30 rounded-2xl p-12 text-center shadow-2xl">
        <div className="absolute top-4 right-4 text-3xl opacity-20">🌸</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-20">⚔️</div>
        <div className="text-slate-300 text-lg mb-4">
          You haven't subscribed to any channels yet
        </div>
        <div className="text-4xl">🎭</div>
      </div>
    );

  return (
    <div className="relative bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-orange-500/30 overflow-hidden">
      {/* Anime decorative background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Katana decoration */}
      <div className="absolute top-8 right-8 opacity-5 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
          <line x1="10" y1="90" x2="90" y2="10" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="10" cy="90" r="4" fill="#fbbf24"/>
        </svg>
      </div>

      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-8">
        <div className="text-3xl animate-pulse">📺</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Subscribed Channels
        </h2>
        <div className="text-2xl" style={{ animation: 'float-gentle 3s ease-in-out infinite' }}>🔥</div>
      </div>

      {/* Grid */}
      <div className="relative grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscriptions.map((sub, index) => {
          const info = sub?.channelInfo?.[0];
          if (!info) return null;

          return (
            <div
              key={info?._id}
              onClick={() => navigate(`/channel/${info?.username}`)}
              className="group relative bg-slate-900/60 backdrop-blur-md border-2 border-orange-500/20 hover:border-orange-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-orange-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-2xl"></div>
              
              {/* Cover Image */}
              <div className="relative w-full h-28 overflow-hidden">
                <img
                  src={
                    info?.coverImage ||
                    "https://images.unsplash.com/photo-1525186402429-b4ff38bedbec?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={info?.username}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                
                {/* Anime emoji badge */}
                <div className="absolute top-2 right-2 text-xl opacity-60 group-hover:opacity-100 transition-opacity">
                  {index % 4 === 0 && "🌸"}
                  {index % 4 === 1 && "⚔️"}
                  {index % 4 === 2 && "🔥"}
                  {index % 4 === 3 && "⚡"}
                </div>
              </div>

              {/* Content */}
              <div className="relative flex flex-col items-center px-4 pb-5 pt-8 text-center">
                {/* Avatar - positioned to not be cut */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <img
                      src={
                        info?.avatar ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={info?.username}
                      className="relative w-16 h-16 rounded-full border-3 border-orange-500 object-cover shadow-lg ring-4 ring-slate-900 group-hover:ring-orange-500/30 transition-all"
                    />
                    {/* Small anime badge on avatar */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-xs border-2 border-slate-900">
                      {index % 3 === 0 && "🍥"}
                      {index % 3 === 1 && "⚡"}
                      {index % 3 === 2 && "🔥"}
                    </div>
                  </div>
                </div>

                {/* Channel Info */}
                <h3 className="font-bold text-base truncate max-w-full mt-2 bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent group-hover:from-orange-200 group-hover:to-pink-200 transition-all">
                  {info?.fullname || "Unnamed Channel"}
                </h3>
                <p className="text-slate-400 text-xs mb-4 font-medium">@{info?.username}</p>
                
                {/* Visit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/channel/${info?.username}`);
                  }}
                  className="relative px-6 py-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 rounded-xl text-sm font-bold shadow-lg hover:shadow-orange-500/40 transition-all duration-200 border border-orange-400/30"
                >
                  <span className="flex items-center gap-2">
                    Visit <span className="group-hover:animate-pulse">⚡</span>
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}