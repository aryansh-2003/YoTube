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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
      </div>
    );

  if (!subscriptions?.length)
    return (
      <div className="text-gray-400 text-center py-16 text-lg">
        You haven’t subscribed to any channels yet 🎧
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white rounded-3xl p-8 shadow-2xl border border-zinc-800/50 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
        <i className="fa-solid fa-tv text-purple-500"></i>
        <span className="tracking-wide">Subscribed Channels</span>
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {subscriptions.map((sub) => {
          const info = sub?.channelInfo?.[0];
          if (!info) return null;

          return (
            <div
              key={info?._id}
              onClick={() => navigate(`/channel/${info?.username}`)}
              className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-purple-600/40 rounded-2xl overflow-hidden shadow-md hover:shadow-purple-700/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative w-full h-32 overflow-hidden">
                <img
                  src={
                    info?.coverImage ||
                    "https://images.unsplash.com/photo-1525186402429-b4ff38bedbec?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={info?.username}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-80 transition-all" />
              </div>

              <div className="flex flex-col items-center p-5 text-center">
                <img
                  src={
                    info?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={info?.username}
                  className="w-16 h-16 rounded-full border-2 border-zinc-700 -mt-10 mb-2 object-cover shadow-md group-hover:border-purple-500 transition-colors"
                />
                <h3 className="font-semibold text-lg truncate max-w-[90%]">
                  {info?.fullname || "Unnamed Channel"}
                </h3>
                <p className="text-gray-400 text-sm mb-4">@{info?.username}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/channel/${info?.username}`);
                  }}
                  className="px-5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full text-sm font-medium shadow-md hover:shadow-purple-700/40 transition-all duration-200"
                >
                  Visit Channel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
