import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home,
  Flame,
  LayoutGrid,
  Library,
  History,
  ThumbsUp,
  Film,
  Music2,
  GraduationCap,
  Palette,
  LogOut,
  X,
  User,
  Radio,
  Twitter,
  Video,
  Menu,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderContext from "../context/HeaderContext";
import axios from "axios";
import subscriptionService from '../../../Service/subscription';
import { useSelector } from "react-redux";

// ChalChitram Logo Icon
const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4L19 12L5 20V4Z" stroke="#E1AD01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="transparent"/>
    <path d="M5 4L19 12L5 20V4Z" fill="#E1AD01" fillOpacity="0.2"/>
  </svg>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useContext(HeaderContext);
  const userData = useSelector((state) => state?.auth?.userData);
  const [active, setActive] = useState("Home");
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    if (!userData) return;
    subscriptionService.getUserSubscription().then((res) => {
      if (res.status === 200) {
        setSubscriptions(res?.data?.data);
      }
    });
  }, [userData]);

  // Determine active route
  useEffect(() => {
    const path = location.pathname;
    console.log(path)
    if (path.includes("/Home")) setActive("Home");
    else if (path.includes("/Trending")) setActive("Trending");
    else if (path.includes("/subscription")) setActive("Subscriptions");
    else if (path.includes("/Library")) setActive("Library");
    else if (path.includes("/History")) setActive("History");
    else if (path.includes("/liked-videos")) setActive("Liked Videos");
    else if (path.includes("/Tweets")) setActive("Tweets");
    else if (path.includes("/createPost")) setActive("Create");
    else setActive("");
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    // Optional: Close sidebar on mobile after click
    if (window.innerWidth < 768) {
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

  // MenuItem Component
  const MenuItem = ({ name, icon: Icon, path, isActive }) => (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleNavigation(path)}
      className={`relative flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200 group ${
        isActive 
          ? "bg-white/10 text-[#E1AD01]" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="activeTab"
          className="absolute left-0 w-1 h-6 bg-[#E1AD01] rounded-r-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <Icon 
        size={20} 
        strokeWidth={isActive ? 2.5 : 2}
        className={`transition-colors duration-200 ${isActive ? "text-[#E1AD01]" : "group-hover:text-white"}`} 
      />
      <span className={`text-sm font-medium tracking-wide ${isActive ? "font-semibold" : ""}`}>
        {name}
      </span>
    </motion.div>
  );

  const SectionLabel = ({ label }) => (
    <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </div>
  );

  return (
    <>
      {/* Hide Scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {/* Backdrop Overlay (Handles Background Blur) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // This creates the blur effect over the rest of the app
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full z-50 w-[280px] bg-[#0f0f0f] border-r border-[#272727] flex flex-col shadow-2xl"
      >
        
        {/* Header: Logo + Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#272727] shrink-0 bg-[#0f0f0f]">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <LogoIcon />
            <span className="text-xl font-bold text-white tracking-tight">ChalChitram</span>
          </div>
          
          {/* Close Button (Visible on all screens to toggle sidebar off) */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <Menu size={20} className="hidden" /> {/* Logic check: if open, show X */}
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
          
          {/* Main Navigation */}
          <div className="space-y-1">
            <MenuItem name="Home" icon={Home} path="/Home" isActive={active === "Home"} />
            {/* <MenuItem name="Trending" icon={Flame} path="/Trending" isActive={active === "Trending"} /> */}
            <MenuItem name="Subscriptions" icon={LayoutGrid} path="/subscription" isActive={active === "Subscriptions"} />
            <MenuItem name="Tweets" icon={Twitter} path="/Tweets" isActive={active === "Tweets"} />
          </div>

          <div className="my-4 border-t border-[#272727] mx-2" />

          {/* Library Section */}
          <div className="space-y-1">
            <MenuItem name="Create" icon={Plus} path="/createpost" isActive={active === "Create"} />
            <MenuItem name="History" icon={History} path="/History" isActive={active === "History"} />
            <MenuItem name="Liked Videos" icon={ThumbsUp} path="/liked-videos" isActive={active === "Liked Videos"} />
            <MenuItem name="Your Content" icon={Video} path="/userVideos" isActive={active === "Your Content"} />
          </div>

          <div className="my-4 border-t border-[#272727] mx-2" />

          {/* Subscriptions Section */}
          <SectionLabel label="Subscriptions" />
          <div className="space-y-1">
            {subscriptions && subscriptions.length > 0 ? (
               subscriptions.map((sub) => {
                 const channelName = sub.channelInfo?.[0]?.fullname || "Unknown";
                 const username = sub.channelInfo?.[0]?.username;
                 const avatar = sub.channelInfo?.[0]?.avatar;

                 return (
                   <motion.div
                     key={channelName}
                     whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                     onClick={() => handleNavigation(`/channel/${username}`)}
                     className="flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-gray-400 hover:text-white transition-colors"
                   >
                     {avatar ? (
                        <img src={avatar} alt={channelName} className="w-6 h-6 rounded-full object-cover" />
                     ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-[10px] text-white font-bold">
                          {channelName.charAt(0)}
                        </div>
                     )}
                     <span className="text-sm font-medium truncate">{channelName}</span>
                   </motion.div>
                 );
               })
            ) : (
              <div className="px-4 py-2 text-xs text-gray-600 italic">No subscriptions yet</div>
            )}
          </div>

          <div className="my-4 border-t border-[#272727] mx-2" />

          {/* Genres / Explore Section */}
          <SectionLabel label="Genres" />
          <div className="space-y-1">
            <MenuItem name="Documentary" icon={Radio} path="/genre/documentary" isActive={false} />
            <MenuItem name="Film" icon={Film} path="/genre/film" isActive={false} />
            <MenuItem name="Music" icon={Music2} path="/genre/music" isActive={false} />
            <MenuItem name="Education" icon={GraduationCap} path="/genre/education" isActive={false} />
            <MenuItem name="Art" icon={Palette} path="/genre/art" isActive={false} />
          </div>
        </div>

        {/* Footer / User Profile (Fixed at bottom, doesn't scroll with content) */}
        <div className="p-4 border-t border-[#272727] bg-[#0f0f0f] shrink-0">
          {userData ? (
            <div className="flex items-center gap-3 mb-3 px-2">
               <img 
                 src={userData.avatar || "https://via.placeholder.com/40"} 
                 alt="Profile" 
                 className="w-9 h-9 rounded-full object-cover border border-[#272727]"
               />
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{userData.fullname || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">@{userData.username || "username"}</p>
               </div>
            </div>
          ) : (
             <div 
               onClick={() => navigate("/login")}
               className="flex items-center gap-3 mb-3 px-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg"
             >
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                   <User size={18} />
                </div>
                <p className="text-sm font-bold text-white">Sign In</p>
             </div>
          )}
          
          <button 
            onClick={logOutHandler}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wide transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

      </motion.aside>
    </>
  );
}