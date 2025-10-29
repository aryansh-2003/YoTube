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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subscriptions?.length) {
    return (
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-xl p-12 text-center">
        <div className="text-white/40 text-sm">
          You haven't subscribed to any channels yet
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white/[0.02] backdrop-blur-sm rounded-xl p-8 border border-white/5">
      {/* Subtle ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/3 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/3 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative mb-8">
        <h2 className="text-2xl font-medium text-white/90">
          Subscribed Channels
        </h2>
      </div>

      {/* Grid */}
      <div className="relative grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscriptions.map((sub) => {
          const info = sub?.channelInfo?.[0];
          if (!info) return null;

          return (
            <div
              key={info?._id}
              onClick={() => navigate(`/channel/${info?.username}`)}
              className="group relative bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Cover Image */}
              <div className="relative w-full h-24 overflow-hidden">
                <img
                  src={
                    info?.coverImage ||
                    "https://images.unsplash.com/photo-1525186402429-b4ff38bedbec?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={info?.username}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative flex flex-col items-center px-4 pb-5 pt-8 text-center">
                {/* Avatar */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <img
                    src={
                      info?.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={info?.username}
                    className="w-16 h-16 rounded-full border-2 border-white/10 object-cover ring-4 ring-[#0a0a0a]"
                  />
                </div>

                {/* Channel Info */}
                <h3 className="font-medium text-sm truncate max-w-full mt-2 text-white/90 group-hover:text-white">
                  {info?.fullname || "Unnamed Channel"}
                </h3>
                <p className="text-white/40 text-xs mb-4">@{info?.username}</p>
                
                {/* Visit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/channel/${info?.username}`);
                  }}
                  className="px-5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white/70 hover:text-white"
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