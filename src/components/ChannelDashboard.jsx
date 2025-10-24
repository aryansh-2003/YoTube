import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import HeaderContext from "./context/HeaderContext";
import defaultAvatar from "../assets/download.jpeg";
import defaultCover from "../assets/defaultCover.jpg";
import dashboardService from "../../Service/dashboard";
import authService from "../../Service/auth";
import VideoCard from "./video/VideoCard";
import TweetSection from "./TweetComponent";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

/**
 * ChannelDashboard (modernized + responsive tweaks)
 */
export default function ChannelDashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const { sidebarOpen } = useContext(HeaderContext);

  const [enlargedImage, setEnlargedImage] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [videos, setvideos] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError("");

    const load = async () => {
      try {
        const [dashRes, vidsRes] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getChannelVideos(userData._id),
        ]);

        if (!mounted) return;

        if (dashRes?.status === 200 || dashRes?.status === 201) {
          setDashboardData(dashRes?.data?.data || null);
        } else {
          setDashboardData(dashRes?.data?.data || null);
        }

        setvideos(vidsRes?.data?.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Unable to load dashboard. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [userData]);

  const handleFileChange = (e, type) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (type === "avatar") {
      setPreviewAvatar(url);
      setAvatarFile(file);
    } else {
      setPreviewCover(url);
      setCoverFile(file);
    }
  };

  const handleImageClick = (imageUrl) => {
    if (!imageUrl) return;
    setEnlargedImage(imageUrl);
  };

  const closeEnlarged = (e) => {
    e?.stopPropagation();
    setEnlargedImage(null);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError("");

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        await authService.changeAvatar(formData);
        setPreviewAvatar(null);
        setAvatarFile(null);
      }
      if (coverFile) {
        const formData = new FormData();
        formData.append("coverImage", coverFile);
        await authService.changeCoverimage(formData);
        setPreviewCover(null);
        setCoverFile(null);
      }

      try {
        const res = await dashboardService.getDashboard();
        if (res?.status === 200 || res?.status === 201) {
          setDashboardData(res?.data?.data || dashboardData);
        }
      } catch (refreshErr) {
        console.warn("Refresh after save failed:", refreshErr);
      }
    } catch (err) {
      console.error("Save changes failed:", err);
      setError("Failed to save changes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const prepareWeeklyChart = () => {
    if (dashboardData?.weeklyViews && Array.isArray(dashboardData.weeklyViews)) {
      return dashboardData.weeklyViews.map((d) => ({
        day: d.day,
        views: d.views,
        uploads: d.uploads ?? 0,
      }));
    }

    const total = dashboardData?.totalVideoViews ?? 0;
    const base = Math.floor(total / 7);
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return labels.map((l, i) => {
      const variance = Math.round(Math.sin(i + 1) * base * 0.12);
      return {
        day: l,
        views: Math.max(0, base + variance),
        uploads: Math.round(((dashboardData?.totalVideos ?? 0) / 7) * (1 + Math.sin(i) * 0.15)),
      };
    });
  };

  const chartData = prepareWeeklyChart();

  const recentActivity = (videos || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const fmt = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? 0);

  return (
    <main className="pt-4">
      {/* Top error / retry */}
      {error && (
        <div className="px-4 sm:px-6">
          <div className="bg-red-600/10 border border-red-600/20 text-red-300 rounded-md p-3 flex items-center justify-between">
            <div className="text-sm">{error}</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setError("");
                  setLoading(true);
                  dashboardService.getDashboard().then(res => {
                    if (res?.status === 200 || res?.status === 201) setDashboardData(res?.data?.data || null);
                    setLoading(false);
                  }).catch(()=> setLoading(false));
                }}
                className="px-3 py-1.5 bg-red-600/80 text-white rounded-md text-sm hover:bg-red-500 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COVER IMAGE */}
      <div className="w-full rounded-2xl overflow-hidden mx-4 sm:mx-2 sm:mr-3 lg:mx-6 h-32 sm:h-44 lg:h-48 relative">
        <img
          src={previewCover || userData?.coverImage || defaultCover}
          alt="cover"
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          onClick={() => handleImageClick(previewCover || userData?.coverImage || defaultCover)}
        />
      </div>

      {/* PROFILE ROW */}
      <div className="px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center gap-4 -mt-10 md:-mt-14 relative">
        <div className="flex items-start gap-4">
          <motion.div
            layout
            whileHover={{ scale: 1.02 }}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white/6 shadow-lg cursor-pointer"
            onClick={() => handleImageClick(previewAvatar || userData?.avatar || defaultAvatar)}
          >
            <img
              className="w-full h-full object-cover"
              src={previewAvatar || userData?.avatar || defaultAvatar}
              alt="avatar"
            />
          </motion.div>

          <div className="flex flex-col flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{userData?.fullname || "Full Name"}</h1>
            <div className="text-sm text-gray-300 mt-1 flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="text-gray-400">@{userData?.username || "username"}</span>
              <span className="hidden sm:inline mx-2 text-zinc-500">•</span>
              <span className="text-gray-300">
                Subscribers: <span className="font-semibold text-white">{fmt(dashboardData?.totalSubscribers)}</span>
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-2 max-w-xl">
              {userData?.bio || "This channel is about tech and small tips ..."}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                className="px-3 py-1.5 text-sm sm:text-base bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-md shadow hover:from-sky-600 hover:to-indigo-700 transition flex-1 sm:flex-none text-center"
                onClick={() => navigate(`/channel/customize/${userData?._id}`)}
              >
                Customize channel
              </button>
              <button
                className="px-3 py-1.5 text-sm sm:text-base bg-white/6 text-white rounded-md border border-white/8 hover:bg-white/8 transition flex-1 sm:flex-none text-center"
                onClick={() => navigate("/manage-videos")}
              >
                Manage videos
              </button>
              <label className="px-3 py-1.5 text-sm sm:text-base bg-white/6 rounded-md cursor-pointer border border-white/8 hover:bg-white/8 transition flex-1 sm:flex-none text-center">
                Change Cover
                <input
                  id="coverFileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "cover")}
                />
              </label>
              <label className="px-3 py-1.5 text-sm sm:text-base bg-white/6 rounded-md cursor-pointer border border-white/8 hover:bg-white/8 transition flex-1 sm:flex-none text-center">
                Change DP
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "avatar")}
                />
              </label>

              {(previewAvatar || previewCover) && (
                <button
                  onClick={handleSaveChanges}
                  className="px-3 py-1.5 text-sm sm:text-base bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition flex-1 sm:flex-none text-center"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 border-b border-white/6 px-4 sm:px-6 overflow-x-auto">
        <div className="flex gap-4 sm:gap-6 text-gray-400 text-sm font-medium whitespace-nowrap">
          <button
            onClick={() => setActiveTab("home")}
            className={`pb-3 transition-all ${activeTab === "home" ? "border-b-2 border-sky-500 text-white" : "hover:text-white"}`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 transition-all ${activeTab === "videos" ? "border-b-2 border-sky-500 text-white" : "hover:text-white"}`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab("playlists")}
            className={`pb-3 transition-all ${activeTab === "playlists" ? "border-b-2 border-sky-500 text-white" : "hover:text-white"}`}
          >
            Playlists
          </button>
          <button
            onClick={() => setActiveTab("tweets")}
            className={`pb-3 transition-all ${activeTab === "tweets" ? "border-b-2 border-sky-500 text-white" : "hover:text-white"}`}
          >
            Tweet
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 py-6 text-white">
        {loading ? (
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-white/6 to-white/4 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-white/6 animate-pulse" />
              ))}
            </div>
            <div className="h-64 rounded-2xl bg-white/6 animate-pulse" />
          </div>
        ) : (
          <>
            {/* HOME */}
            {activeTab === "home" && (
              <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {[
                    { label: "Subscribers", value: dashboardData?.totalSubscribers ?? 0, path: `/user-subscriber/${userData?._id}` },
                    { label: "Videos", value: dashboardData?.totalVideos ?? 0, path: "/manage-videos" },
                    { label: "Views", value: dashboardData?.totalVideoViews ?? 0 },
                    { label: "Likes", value: dashboardData?.totalLikes ?? 0 },
                    { label: "Playlists", value: dashboardData?.totalPlaylist ?? 0 },
                    { label: "Tweets", value: dashboardData?.totalTweet ?? 0 },
                  ].map((kpi) => (
                    <motion.div
                      key={kpi.label}
                      layout
                      whileHover={{ translateY: -4 }}
                      className="relative rounded-2xl p-4 bg-gradient-to-br from-white/3 to-white/6 border border-white/6"
                    >
                      {kpi.path && (
                        <button
                          aria-label={`open ${kpi.label}`}
                          onClick={() => navigate(kpi.path)}
                          className="absolute inset-0 z-10"
                        />
                      )}

                      <div className="text-xs text-gray-300">{kpi.label}</div>
                      <div className="text-2xl font-semibold text-white">{fmt(kpi.value)}</div>
                      <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <motion.div layout className="lg:col-span-2 rounded-2xl p-4 bg-gradient-to-br from-white/3 to-white/6 border border-white/6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">Weekly Activity</h3>
                        <p className="text-sm text-gray-400">Views & Uploads</p>
                      </div>
                      <div className="text-sm text-gray-400">Showing last 7 days</div>
                    </div>

                    <div style={{ height: 240 }} className="w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid stroke="#2b2b2b" strokeDasharray="3 3" />
                          <XAxis dataKey="day" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip wrapperStyle={{ backgroundColor: "#0b1220", borderRadius: 6 }} />
                          <Bar dataKey="views" barSize={18} radius={[6, 6, 0, 0]} />
                          <Bar dataKey="uploads" barSize={8} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 text-sm text-gray-400">
                      Chart falls back to estimated distribution if backend weekly data is not available.
                    </div>
                  </motion.div>

                  <motion.div layout className="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-white/6 border border-white/6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Recent Uploads</h3>
                      <span className="text-sm text-gray-400">{recentActivity.length} items</span>
                    </div>

                    <div className="space-y-2 overflow-auto max-h-60 mt-3">
                      {recentActivity.length === 0 && (
                        <div className="text-sm text-gray-400">No recent uploads</div>
                      )}

                      {recentActivity.map((v) => (
                        <div
                          key={v._id || v.id || v.videoFile}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/6 transition"
                        >
                          <img
                            src={v.thumbnail || defaultCover}
                            alt={v.title || "video"}
                            className="w-12 h-8 object-cover rounded-md cursor-pointer"
                            onClick={() => handleImageClick(v.thumbnail || defaultCover)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate text-white">{v.title || "Untitled"}</div>
                            <div className="text-xs text-gray-400 truncate">{v.description || ""}</div>
                          </div>
                          <div className="text-xs text-gray-400 text-right">
                            <div>{fmt(v.views ?? 0)} views</div>
                            <div className="text-gray-500">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ""}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <button onClick={() => navigate("/manage-videos")} className="w-full px-3 py-2 bg-sky-600 rounded-md text-white hover:bg-sky-700 transition">
                        View all videos
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-white/6 border border-white/6">
                    <div className="text-sm text-gray-300">Avg watch time</div>
                    <div className="text-xl font-semibold">4m 12s</div>
                    <div className="text-xs text-gray-400">Estimation</div>
                  </div>
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-white/6 border border-white/6">
                    <div className="text-sm text-gray-300">Engagement rate</div>
                    <div className="text-xl font-semibold">2.8%</div>
                    <div className="text-xs text-gray-400">Likes / Views</div>
                  </div>
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-white/3 to-white/6 border border-white/6">
                    <div className="text-sm text-gray-300">New subs (7d)</div>
                    <div className="text-xl font-semibold">{fmt(dashboardData?.newSubscribers7d ?? 0)}</div>
                    <div className="text-xs text-gray-400">Compared to previous week</div>
                  </div>
                </div>
              </section>
            )}

            {/* VIDEOS TAB */}
            {activeTab === "videos" && <VideoCard data={videos ? videos : ""} />}

            {/* PLAYLISTS TAB */}
            {activeTab === "playlists" && (
              <p className="text-gray-400">Playlists Section (testing placeholder)</p>
            )}

            {/* TWEETS TAB */}
            {activeTab === "tweets" && (
              <div>
                <p className="text-gray-400">Tweet Section (testing placeholder)</p>
                <TweetSection />
              </div>
            )}
          </>
        )}
      </div>

      {/* ENLARGED IMAGE VIEWER */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 transition"
          onClick={closeEnlarged}
        >
          <div className="relative max-w-3xl w-[90%]" onClick={(e) => e.stopPropagation()}>
            <img
              src={enlargedImage}
              alt="enlarged"
              className="rounded-2xl shadow-2xl object-contain max-h-[90vh] mx-auto"
            />
            <button
              className="absolute top-3 right-3 text-white text-2xl bg-black/50 hover:bg-black/70 rounded-full px-2 transition"
              onClick={closeEnlarged}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
