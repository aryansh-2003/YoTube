import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ChannelCover from "../components/userProfile/ChannelCover";
import ChannelInfo from "../components/userProfile/ChannelInfo";
import Tabs from "../components/userProfile/Tabs";
import authService from "../../Service/auth";
import dashboardService from "../../Service/dashboard.js";

export default function ChannelPage() {
  const { username } = useParams();
  const navigate = useNavigate();
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
        setError("Unable to load channel");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [username]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] text-white/60 text-base">
        {error || "Channel not found"}
      </div>
    );
  }

  return (
    <div className="relative bg-[#0a0a0a] text-white min-h-screen overflow-hidden">
      {/* Sophisticated ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-[#0a0a0a] to-neutral-900/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Subtle grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-10 mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      {/* Content */}
      <div className="relative z-20">
        <ChannelCover coverImage={channel.coverImage} />
        <ChannelInfo channel={channel} />
        <Tabs />

        {/* Channel Stats */}
        <section className="px-6 md:px-12 py-8 border-b border-white/5">
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <span className="font-medium text-white/70">{channel.subscriberCount?.toLocaleString() || "0"}</span>
              <span>Subscribers</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-2">
              <span className="font-medium text-white/70">{channel.viewCount?.toLocaleString() || "0"}</span>
              <span>Views</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-2">
              <span className="font-medium text-white/70">{videos.length}</span>
              <span>Videos</span>
            </span>
            <span className="text-white/20">•</span>
            <span>Joined {new Date(channel.createdAt).toLocaleDateString()}</span>
          </div>
        </section>

        {/* Videos Section */}
        <section className="px-6 md:px-12 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-white/90">Latest Uploads</h2>
          </div>

          {videos.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  onClick={() => handleVideoClick(video._id)}
                  className="group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/5 mb-3">
                    <div className="aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="space-y-1">
                    <h3 className="font-medium text-white/90 text-sm line-clamp-2 leading-snug group-hover:text-white">
                      {video.title}
                    </h3>
                    <p className="text-white/50 text-xs">
                      {video.views?.toLocaleString() || "0"} views
                      {video.uploadedAt && ` • ${video.uploadedAt}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/40 py-20 text-sm">
              No videos uploaded yet
            </div>
          )}
        </section>
      </div>
    </div>
  );
}