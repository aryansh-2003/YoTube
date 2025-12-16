import React, { useContext, useState, useEffect, useRef } from "react";
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
import { Camera, Edit2, Upload, Users, Eye, PlaySquare, Heart, MessageSquare } from "lucide-react";

export default function ChannelDashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const { sidebarOpen } = useContext(HeaderContext);

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hidden file inputs refs
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [dashRes, vidsRes] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getChannelVideos(userData._id),
        ]);

        if (dashRes?.status === 200) {
          setDashboardData(dashRes?.data?.data);
        }
        if (vidsRes?.status === 200) {
          setVideos(vidsRes?.data?.data || []);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userData]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const formData = new FormData();

    try {
      if (type === "avatar") {
        setPreviewAvatar(url);
        formData.append("avatar", file);
        await authService.changeAvatar(formData);
      } else {
        setPreviewCover(url);
        formData.append("coverImage", file);
        await authService.changeCoverimage(formData);
      }
      // Optional: Refresh dashboard data here if needed
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Chart Data Preparation
  const chartData = React.useMemo(() => {
    if (dashboardData?.weeklyViews?.length) {
      return dashboardData.weeklyViews;
    }
    // Mock data for UI visualization if API is empty
    return [
      { day: "Mon", views: 120 },
      { day: "Tue", views: 200 },
      { day: "Wed", views: 150 },
      { day: "Thu", views: 300 },
      { day: "Fri", views: 250 },
      { day: "Sat", views: 400 },
      { day: "Sun", views: 380 },
    ];
  }, [dashboardData]);

  const statsCards = [
    { label: "Total Subscribers", value: dashboardData?.totalSubscribers || 0, icon: Users },
    { label: "Total Views", value: dashboardData?.totalVideoViews || 0, icon: Eye },
    { label: "Total Videos", value: dashboardData?.totalVideos || 0, icon: PlaySquare },
    { label: "Total Likes", value: dashboardData?.totalLikes || 0, icon: Heart },
  ];

  const fmt = (n) => (n ? n.toLocaleString() : "0");

  if (loading) {
    return <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20">
      
      {/* --- CHANNEL HEADER --- */}
      <div className="relative w-full">
        {/* Cover Image */}
        <div className="group relative w-full h-48 md:h-64 bg-[#1a1a1a] overflow-hidden">
          <img
            src={previewCover || userData?.coverImage || defaultCover}
            alt="cover"
            className="w-full h-full object-cover"
          />
          {/* Edit Cover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => coverInputRef.current.click()}
              className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-all border border-white/20"
            >
              <Camera size={18} />
              <span className="text-sm font-medium">Change Cover</span>
            </button>
            <input ref={coverInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, "cover")} />
          </div>
        </div>

        {/* Channel Info Bar */}
        <div className="max-w-[1600px] mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-12 md:-mt-8 mb-8">
            
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-[#0f0f0f] bg-[#1a1a1a] overflow-hidden relative">
                <img
                  src={previewAvatar || userData?.avatar || defaultAvatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
                {/* Edit Avatar Overlay */}
                <div 
                  onClick={() => avatarInputRef.current.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <Camera size={24} className="text-white" />
                </div>
                <input ref={avatarInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} />
              </div>
            </div>

            {/* Text Info */}
            <div className="flex-1 pt-10 md:pt-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{userData?.fullname}</h1>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <span>@{userData?.username}</span>
                    <span>•</span>
                    <span>{fmt(dashboardData?.totalSubscribers)} subscribers</span>
                    <span>•</span>
                    <span>{dashboardData?.totalVideos} videos</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/under-construction')}
                    className="bg-[#272727] hover:bg-[#333] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-gray-600"
                  >
                    Customize Channel
                  </button>
                  <button 
                    onClick={() => navigate('/manage-videos')}
                    className="bg-[#E1AD01] hover:bg-[#c29401] text-black px-4 py-2 rounded-full text-sm font-bold transition-colors"
                  >
                    Manage Videos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-[#272727] text-sm font-medium text-gray-400 overflow-x-auto">
            {["Home", "Videos", "Playlists", "Community"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-3 capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? "text-white border-b-2 border-[#E1AD01]"
                    : "hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- DASHBOARD CONTENT --- */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        
        {/* HOME TAB - Dashboard Overview */}
        {activeTab === "home" && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, idx) => (
                <div key={idx} className="bg-[#1a1a1a] border border-[#272727] p-6 rounded-xl flex items-start justify-between group hover:border-white/10 transition-colors">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white">{fmt(stat.value)}</h3>
                  </div>
                  <div className="p-3 bg-[#252525] rounded-lg text-[#E1AD01]">
                    <stat.icon size={20} />
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid: Chart + Recent Videos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Analytics Chart */}
              <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#272727] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Channel Analytics</h3>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Last 7 Days</span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#888', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#888', fontSize: 12 }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        cursor={{ fill: '#272727' }}
                      />
                      <Bar 
                        dataKey="views" 
                        fill="#E1AD01" 
                        radius={[4, 4, 0, 0]} 
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Uploads List */}
              <div className="bg-[#1a1a1a] border border-[#272727] rounded-xl p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Recent Uploads</h3>
                  <button 
                    onClick={() => navigate('/manage-videos')}
                    className="text-xs text-[#E1AD01] font-semibold hover:underline"
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar max-h-[300px] lg:max-h-none">
                  {videos.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center py-10">No videos uploaded yet.</div>
                  ) : (
                    videos.slice(0, 5).map((video) => (
                      <div key={video._id} className="flex gap-3 group cursor-pointer" onClick={() => navigate(`/video/${video._id}`)}>
                        <div className="w-24 h-14 bg-black rounded-md overflow-hidden shrink-0 border border-[#272727]">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate group-hover:text-[#E1AD01] transition-colors">
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>{fmt(video.views)} views</span>
                            <span>•</span>
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <button 
                  onClick={() => navigate('/createpost')}
                  className="w-full mt-6 py-2.5 rounded-lg border border-dashed border-[#444] text-gray-400 hover:text-white hover:border-gray-200 hover:bg-[#222] transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Upload size={16} />
                  Upload New Video
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="w-full">
            <VideoCard data={videos} />
          </div>
        )}

        {/* COMMUNITY TAB (Previously Tweets) */}
        {activeTab === "community" && (
          <div className="max-w-2xl mx-auto">
             <TweetSection />
          </div>
        )}

        {/* PLAYLISTS TAB Placeholder */}
        {activeTab === "playlists" && (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-lg font-medium text-white mb-2">No Playlists Created</h3>
            <p className="text-sm">Create playlists to organize your content for viewers.</p>
          </div>
        )}
      </div>

      {/* Global styles for this component */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}