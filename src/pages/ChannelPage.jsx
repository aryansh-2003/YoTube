import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ChannelCover from "../components/userProfile/ChannelCover";
import ChannelInfo from "../components/userProfile/ChannelInfo";
import Tabs from "../components/userProfile/Tabs";
import authService from "../../Service/auth";
import dashboardService from "../../Service/dashboard.js";

export default function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await authService.getUserChannel({ channel: username });
        const data = res?.data?.data;
        if (!data || !data._id) {
          setError("Channel not found");
          return;
        }

        if (mounted) setChannel(data);

        const vids = await dashboardService.getChannelVideos(data._id);
        if (mounted) setVideos(vids?.data?.data || []);
      } catch (err) {
        console.error("Error loading channel:", err);
        setError("Something went wrong while loading this channel 😔");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [username]);

  // --- Loading Spinner ---
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-sm text-purple-400 font-medium">
            Loading...
          </span>
        </div>
      </div>
    );

  // --- Error or Missing Channel ---
  if (error || !channel)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-400 text-lg">
        {error || "Channel not found 😔"}
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-black via-zinc-950 to-black text-white min-h-screen overflow-hidden">
      {/* Channel Header */}
      <ChannelCover coverImage={channel.coverImage} />
      <ChannelInfo channel={channel} />
      <Tabs />

      {/* --- Sleek Channel Stats Bar --- */}
      <section className="relative py-10 px-6 md:px-12 border-b border-zinc-800/40">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-sm md:text-base font-light tracking-wide text-gray-300">
          <span className="flex items-center gap-2 hover:text-purple-400 transition-all">
            👥 <span>{channel.subscriberCount?.toLocaleString() || "0"} Subscribers</span>
          </span>
          <span className="hidden md:block text-zinc-600">•</span>
          <span className="flex items-center gap-2 hover:text-indigo-400 transition-all">
            👁️ <span>{channel.viewCount?.toLocaleString() || "0"} Views</span>
          </span>
          <span className="hidden md:block text-zinc-600">•</span>
          <span className="flex items-center gap-2 hover:text-pink-400 transition-all">
            📹 <span>{videos.length} Videos</span>
          </span>
          <span className="hidden md:block text-zinc-600">•</span>
          <span className="flex items-center gap-2 hover:text-yellow-400 transition-all">
            📅 <span>Joined {new Date(channel.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
      </section>

      {/* --- Latest Uploads --- */}
      <section className="px-6 md:px-12 py-12">
        <div className="flex justify-between items-center mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-wide">
            {channel.fullname.toUpperCase()}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Latest Uploads
            </span>
          </h2>
        </div>

        {videos.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((video) => (
              <div
                key={video._id}
                className="group relative bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-600/30 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {video.duration || "00:00"}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {video.views?.toLocaleString()} views • {video.uploadedAt}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20 text-lg italic">
            No videos uploaded yet.
          </div>
        )}
      </section>
    </div>
  );
}
