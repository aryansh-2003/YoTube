import { useEffect, useState } from "react";
import subscriptionService from "../../Service/subscription";
import { useNavigate } from "react-router";

export default function UserSubscribers({ channelId }) {
  console.log(channelId)
  const [subscribers, setSubscribers] = useState();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    if (!channelId) return;
    setLoading(true);

    subscriptionService.getUserSubscribers({id:channelId})
      .then((res) => {
        console.log(res)
        if(res.status === 200 || 201){
            setSubscribers(res?.data?.data || []);
        }
        
      })
      .finally(() => setLoading(false));
  }, [channelId]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );

  if (!subscribers.length)
    return (
      <div className="text-gray-400 text-center py-10">
        No subscribers yet 😔
      </div>
    );
  return (
    <div className="bg-gradient-to-b from-zinc-950 to-black text-white rounded-2xl p-6 shadow-lg border border-zinc-800">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <i className="fa-solid fa-users text-purple-500"></i>
        Subscribers
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscribers.map((user) => (
          <div
            key={user?.subscriberInfo?.[0]?._id}
            className="bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 rounded-xl p-4 flex flex-col items-center gap-3 shadow-md hover:shadow-purple-700/20"
          >
            <img
              src={
                user.subscriberInfo?.[0]?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={user.subscriberInfo?.[0]?.username}
              className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 hover:border-purple-500 transition-all"
            />
            <div className="text-center">
              <h3 className="font-semibold text-lg">{user.subscriberInfo?.[0]?.fullname}</h3>
              <p className="text-gray-400 text-sm">@{user.subscriberInfo?.[0]?.username}</p>
            </div>
          
            <button onClick={() => navigate(`/channel/${user.subscriberInfo?.[0]?.username}`)} className="mt-3 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm transition-all ">
              View Channel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
