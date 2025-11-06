import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home,
  Play,
  Users,
  Video,
  Clock,
  ThumbsUp,
  ChevronRight,
  LogOut,
  Menu,
  User2,
  BirdIcon,
} from "lucide-react";
import HeaderContext from "../context/HeaderContext";
import axios from "axios";
import chalchitramText from "../../assets/chalchitramText.png";
import chalchitram from "../../assets/chalchitram.png";
import subscriptionService from '../../../Service/subscription'
import { useSelector } from "react-redux";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useContext(HeaderContext);
  const userData = useSelector((state) => state?.auth?.userData);
  const [active, setActive] = useState("");
  const [subscriptions,setSubscriptions] = useState()

  useEffect(() => {
    if(!userData) return
      subscriptionService.getUserSubscription().then((res) => {
        if(res.status === 200){
          setSubscriptions(res?.data?.data)
        }
      });
  } ,[userData])
  console.log(subscriptions)
  // Detect active route
  const deriveActiveFromPath = (pathname) => {
    if (pathname.startsWith("/Home")) return "Home";
    if (pathname.startsWith("/Subscriptions")) return "Subscriptions";
    if (pathname.startsWith("/CreatePost")) return "Create +";
    if (pathname.startsWith("/History")) return "History";
    if (pathname.startsWith("/Playlists")) return "Playlists";
    if (pathname.startsWith("/userVideos")) return "Your videos";
    if (pathname.startsWith("/liked-videos")) return "Liked videos";
    if (pathname.startsWith("/channel/news")) return "News";
    if (pathname.startsWith("/channel/amit")) return "Amit";
    if (pathname.startsWith("/channel/hot")) return "HotDays";
    return "";
  };

  useEffect(() => {
    setActive(deriveActiveFromPath(location.pathname));
  }, [location.pathname]);

  const handleClick = (name, path) => {
    if (path) {
      navigate(path);
      setSidebarOpen(false);
    }
  };

  const logOutHandler = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-100 text-white transition-all duration-500 ease-in-out transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        bg-gradient-to-b from-[#111111]/90 to-[#1c1c1c]/90 backdrop-blur-xl border-r border-white/10
        w-[75%] sm:w-[60%] md:w-[18%] shadow-[0_0_20px_rgba(255,80,80,0.15)]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            {sidebarOpen && (
              <div className="flex items-center gap-1">
                <img src={chalchitram} alt="logo" className="w-8 h-8" />
                <img src={chalchitramText} alt="text" className="h-6" />
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="py-5 overflow-y-auto scrollbar-hide h-[calc(100%-64px)] px-3">
          {/* Top Links */}
          <div className="space-y-2 mb-6">
            {[
              ["Home", "/Home", <Home />],
              ["Subscriptions", "/subscription", <Users />],
              ["Create +", "/CreatePost", <Video />],
              ["Tweets ", "/Tweets", <BirdIcon />]
            ].map(([name, path, icon]) => (
              <div
                key={name}
                onClick={() => handleClick(name, path)}
                className={`flex items-center gap-4 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200
                ${
                  active === name
                    ? "bg-gradient-to-r from-pink-600 to-red-500 shadow-[0_0_15px_rgba(255,100,100,0.3)]"
                    : "hover:bg-white/10"
                }`}
              >
                {React.cloneElement(icon, { className: "w-5 h-5" })}
                <span className="text-sm font-medium tracking-wide">{name}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 my-4" />

          {/* User Section */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 px-4 py-1 mb-2">
              <span className="text-base font-semibold text-gray-300">You</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {[
              ["History", "/History", <Clock />],
              ["Playlists", "/Playlists", <Play />],
              ["Your videos", "/userVideos", <Video />],
              ["Liked videos", "/liked-videos", <ThumbsUp />],
              ["Profile", "/channeldashboard", <User2 />],
            ].map(([name, path, icon]) => (
              <div
                key={name}
                onClick={() => handleClick(name, path)}
                className={`flex items-center gap-4 px-4 py-2 rounded-xl cursor-pointer transition-all
                ${
                  active === name
                    ? "bg-gradient-to-r from-red-600 to-pink-600 shadow-[0_0_15px_rgba(255,100,100,0.25)]"
                    : "hover:bg-white/10"
                }`}
              >
                {React.cloneElement(icon, { className: "w-5 h-5" })}
                <span className="text-sm font-medium tracking-wide">{name}</span>
              </div>
            ))}

            <div
              onClick={logOutHandler}
              className="flex items-center gap-4 px-4 py-2 rounded-xl cursor-pointer hover:bg-red-600/20 text-red-400 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>

          <div className="border-t border-white/10 my-4" />

          {/* Subscriptions */}
          <div>
            <div className="flex items-center gap-2 px-4 py-1 mb-2">
              <span className="text-base font-semibold text-gray-300">
                Subscriptions
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {subscriptions ? subscriptions.map((subscriber) => (
              <div
                key={subscriber.channelInfo?.[0]?.fullname}
                onClick={() => handleClick(subscriber.channelInfo?.[0]?.fullname, "channel/"+subscriber.channelInfo?.[0]?.username)}
                className={`flex items-center gap-4 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200
                ${
                  active === subscriber.channelInfo?.[0]?.fullname
                    ? "bg-gradient-to-r from-pink-600 to-red-600 shadow-[0_0_15px_rgba(255,80,80,0.3)]"
                    : "hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-8 h-8 text-2xl text-red-700 rounded-full flex items-center justify-center font-bold `}
                >
                  {subscriber.channelInfo?.[0]?.fullname.trim("")?.[0]}
                </div>
                <span className="text-sm font-medium tracking-wide">{subscriber.channelInfo?.[0]?.fullname}</span>
              </div>
            )): ""}
          </div>
        </div>
      </aside>
    </>
  );
}
