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
    <main className="pt-4 relative overflow-hidden">
      {/* Anime Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-500 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 sm:px-6 relative z-10 mb-4">
          <div className="rounded-xl overflow-hidden border-2 border-red-500/40 p-4 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.1) 100%)',
            }}>
            <div className="text-sm text-red-200 font-semibold">{error}</div>
            <button
              onClick={() => {
                setError("");
                setLoading(true);
                dashboardService.getDashboard().then(res => {
                  if (res?.status === 200 || res?.status === 201) setDashboardData(res?.data?.data || null);
                  setLoading(false);
                }).catch(()=> setLoading(false));
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-bold hover:from-red-500 hover:to-red-600 transition-all border border-red-400/30"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* COVER IMAGE with anime styling */}
      <div className="w-full rounded-2xl overflow-hidden mx-4 sm:mx-2 sm:mr-3 lg:mx-6 h-32 sm:h-44 lg:h-56 relative z-10 border-2 border-amber-400/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent z-20"></div>
        <img
          src={previewCover || userData?.coverImage || defaultCover}
          alt="cover"
          className="w-full h-full object-cover transition-all duration-700 transform hover:scale-110 hover:brightness-110 cursor-pointer"
          onClick={() => handleImageClick(previewCover || userData?.coverImage || defaultCover)}
        />
      </div>

      {/* PROFILE ROW with anime effects */}
      <div className="px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center gap-4 -mt-12 md:-mt-16 relative z-20">
        <div className="flex items-start gap-4">
          <motion.div
            layout
            whileHover={{ scale: 1.05 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 shadow-2xl cursor-pointer group"
            style={{
              borderColor: 'rgb(251, 191, 36)',
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)'
            }}
            onClick={() => handleImageClick(previewAvatar || userData?.avatar || defaultAvatar)}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-full opacity-60 blur-xl group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              className="relative w-full h-full object-cover z-10"
              src={previewAvatar || userData?.avatar || defaultAvatar}
              alt="avatar"
            />
          </motion.div>

          <div className="flex flex-col flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.4)' }}>
              {userData?.fullname || "Full Name"}
            </h1>
            <div className="text-sm text-gray-300 mt-1 flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="text-amber-300 font-semibold">@{userData?.username || "username"}</span>
              <span className="hidden sm:inline mx-2 text-amber-400/40">•</span>
              <span className="text-amber-200/80">
                Subscribers: <span className="font-bold text-amber-300">{fmt(dashboardData?.totalSubscribers)}</span>
              </span>
            </div>

            <p className="text-gray-300 text-sm mt-2 max-w-xl">
              {userData?.bio || "This channel is about tech and small tips ..."}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all border border-amber-400/40 font-bold flex-1 sm:flex-none"
                onClick={() => navigate(`/under-construction`)}
                style={{ textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}
              >
                Customize channel
              </button>
              <button
                className="px-4 py-2 text-sm sm:text-base rounded-lg border-2 border-amber-400/40 hover:border-amber-400/70 transition-all font-bold flex-1 sm:flex-none text-amber-200 hover:bg-orange-500/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
                }}
                onClick={() => navigate("/under-construction")}
              >
                Manage videos
              </button>
              <label className="px-4 py-2 text-sm sm:text-base rounded-lg cursor-pointer border-2 border-amber-400/40 hover:border-amber-400/70 transition-all font-bold flex-1 sm:flex-none text-amber-200 hover:bg-orange-500/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
                }}>
                Change Cover
                <input
                  id="coverFileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "cover")}
                />
              </label>
              <label className="px-4 py-2 text-sm sm:text-base rounded-lg cursor-pointer border-2 border-amber-400/40 hover:border-amber-400/70 transition-all font-bold flex-1 sm:flex-none text-amber-200 hover:bg-orange-500/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
                }}>
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
                  className="px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg transition-all font-bold flex-1 sm:flex-none shadow-lg hover:shadow-emerald-500/50 border border-green-400/30"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABS with anime blade style */}
      <div className="mt-6 border-b-2 border-amber-400/30 px-4 sm:px-6 overflow-x-auto relative z-10">
        <div className="flex gap-4 sm:gap-6 text-gray-400 text-sm font-bold whitespace-nowrap">
          {["home", "videos", "playlists", "tweets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-all relative uppercase tracking-wide ${
                activeTab === tab 
                  ? "text-amber-300 border-b-3" 
                  : "hover:text-amber-200"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 shadow-lg shadow-amber-400/50 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 py-6 text-white relative z-10">
        {loading ? (
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg w-48 animate-pulse border border-amber-400/20" />
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 animate-pulse border border-amber-400/20" />
              ))}
            </div>
            <div className="h-64 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 animate-pulse border border-amber-400/20" />
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
                      whileHover={{ translateY: -4, scale: 1.02 }}
                      className="relative rounded-xl p-5 border-2 border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 overflow-hidden group cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.8) 0%, rgba(26, 31, 46, 0.8) 100%)',
                      }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                      
                      {kpi.path && (
                        <button
                          aria-label={`open ${kpi.label}`}
                          onClick={() => navigate(kpi.path)}
                          className="absolute inset-0 z-10"
                        />
                      )}

                      <div className="relative z-20">
                        <div className="text-xs text-amber-300/70 font-semibold uppercase tracking-wider">{kpi.label}</div>
                        <div className="text-3xl font-bold text-amber-100 mt-1" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.3)' }}>{fmt(kpi.value)}</div>
                        <div className="text-xs text-gray-400 mt-2">Last 7 days</div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <motion.div layout className="lg:col-span-2 rounded-xl p-5 border-2 border-amber-400/30 overflow-hidden relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.9) 0%, rgba(26, 31, 46, 0.9) 100%)',
                    }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-amber-100 font-bold text-lg" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.3)' }}>Weekly Activity</h3>
                        <p className="text-sm text-amber-300/60">Views & Uploads</p>
                      </div>
                      <div className="text-sm text-amber-300/60">Last 7 days</div>
                    </div>

                    <div style={{ height: 240 }} className="w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid stroke="#fb923c40" strokeDasharray="3 3" />
                          <XAxis dataKey="day" stroke="#fbbf24" />
                          <YAxis stroke="#fbbf24" />
                          <Tooltip 
                            wrapperStyle={{ 
                              backgroundColor: "#1a1f2e", 
                              borderRadius: 8,
                              border: '2px solid rgba(251, 191, 36, 0.3)'
                            }} 
                            contentStyle={{
                              backgroundColor: "#0f1419",
                              border: 'none'
                            }}
                          />
                          <Bar dataKey="views" fill="url(#colorViews)" barSize={18} radius={[6, 6, 0, 0]} />
                          <Bar dataKey="uploads" fill="url(#colorUploads)" barSize={8} radius={[3, 3, 0, 0]} />
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
                            </linearGradient>
                            <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 text-sm text-amber-300/50">
                      Chart falls back to estimated distribution if backend weekly data is not available.
                    </div>
                  </motion.div>

                  <motion.div layout className="rounded-xl p-5 border-2 border-amber-400/30 overflow-hidden relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.9) 0%, rgba(26, 31, 46, 0.9) 100%)',
                    }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-amber-100 font-bold text-lg" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.3)' }}>Recent Uploads</h3>
                      <span className="text-sm text-amber-300/60">{recentActivity.length} items</span>
                    </div>

                    <div className="space-y-2 overflow-auto max-h-60 mt-4 custom-scrollbar">
                      {recentActivity.length === 0 && (
                        <div className="text-sm text-amber-300/50">No recent uploads</div>
                      )}

                      {recentActivity.map((v) => (
                        <div
                          key={v._id || v.id || v.videoFile}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-500/10 transition-all border border-transparent hover:border-amber-400/30 group"
                        >
                          <img
                            src={v.thumbnail || defaultCover}
                            alt={v.title || "video"}
                            className="w-14 h-10 object-cover rounded-md cursor-pointer border border-amber-400/20 group-hover:border-amber-400/50 transition-all"
                            onClick={() => handleImageClick(v.thumbnail || defaultCover)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate text-amber-100">{v.title || "Untitled"}</div>
                            <div className="text-xs text-amber-300/60 truncate">{v.description || ""}</div>
                          </div>
                          <div className="text-xs text-amber-300/60 text-right">
                            <div className="font-semibold">{fmt(v.views ?? 0)} views</div>
                            <div className="text-gray-500">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ""}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <button onClick={() => navigate("/under-construction")} className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg text-white font-bold hover:from-orange-500 hover:to-red-500 transition-all shadow-lg hover:shadow-orange-500/30 border border-amber-400/30">
                        View all videos
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Avg watch time", value: "4m 12s", sub: "Estimation" },
                    { label: "Engagement rate", value: "2.8%", sub: "Likes / Views" },
                    { label: "New subs (7d)", value: fmt(dashboardData?.newSubscribers7d ?? 0), sub: "Compared to previous week" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-5 border-2 border-amber-400/30 overflow-hidden relative"
                      style={{
                        background: 'linear-gradient(135deg, rgba(15, 20, 25, 0.9) 0%, rgba(26, 31, 46, 0.9) 100%)',
                      }}>
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                      <div className="text-sm text-amber-300/70 font-semibold">{stat.label}</div>
                      <div className="text-2xl font-bold text-amber-100 mt-1" style={{ textShadow: '0 0 15px rgba(251, 191, 36, 0.3)' }}>{stat.value}</div>
                      <div className="text-xs text-amber-300/50 mt-1">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* VIDEOS TAB */}
            {activeTab === "videos" && <VideoCard data={videos ? videos : ""} />}

            {/* PLAYLISTS TAB */}
            {activeTab === "playlists" && (
              <p className="text-amber-300/60">Playlists Section (testing placeholder)</p>
            )}

            {/* TWEETS TAB */}
            {activeTab === "tweets" && (
              <div>
                <p className="text-amber-300/60 mb-4">Tweet Section (testing placeholder)</p>
                <TweetSection />
              </div>
            )}
          </>
        )}
      </div>

      {/* ENLARGED IMAGE VIEWER with anime styling */}
      {enlargedImage && (
        <div
          className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 transition-all"
          style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))'
          }}
          onClick={closeEnlarged}
        >
          <div className="relative max-w-4xl w-[90%]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl opacity-40 blur-2xl"></div>
            <img
              src={enlargedImage}
              alt="enlarged"
              className="relative rounded-2xl shadow-2xl object-contain max-h-[90vh] mx-auto border-4 border-amber-400/50"
            />
            <button
              className="absolute -top-4 -right-4 text-white text-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg border-2 border-amber-400/50"
              onClick={closeEnlarged}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(251, 191, 36, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #f97316, #dc2626);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #fb923c, #ef4444);
        }
      `}</style>
    </main>
  );
}