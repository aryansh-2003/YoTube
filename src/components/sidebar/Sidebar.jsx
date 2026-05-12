import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home, LayoutGrid, Library, History, ThumbsUp, Film,
  Music2, GraduationCap, Palette, LogOut, X, User,
  Radio, Twitter, Video, Plus, Hash, Disc
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderContext from "../context/HeaderContext";
import subscriptionService from "../../../Service/subscription";
import { useSelector } from "react-redux";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import authService from "../../../Service/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/authSlice";

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- LOGO COMPONENT ---
const Logo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="w-8 h-8 bg-[var(--acid-lime)] flex items-center justify-center border border-white/20">
      <div className="w-3 h-3 bg-black transform group-hover:rotate-45 transition-transform duration-300" />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold text-white tracking-tighter leading-none font-display">
        CHAL.CHITRAM
      </span>
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 group-hover:text-[var(--acid-lime)] transition-colors">
        Archive v2.0
      </span>
    </div>
  </div>
);

// --- MENU ITEM COMPONENT ---
const MenuItem = ({ name, icon: Icon, path, isActive, onClick }) => (
  <motion.button
    onClick={() => onClick(path)}
    className={cn(
      "group relative flex items-center w-full gap-4 px-6 py-3.5 transition-all duration-200 border-l-2",
      isActive
        ? "border-[var(--acid-lime)] bg-white/[0.03]"
        : "border-transparent hover:bg-white/[0.02] hover:border-white/20"
    )}
  >
    {/* Icon Wrapper */}
    <div className={cn(
      "relative z-10 transition-colors duration-200",
      isActive ? "text-[var(--acid-lime)]" : "text-gray-500 group-hover:text-white"
    )}>
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    </div>

    {/* Text Label */}
    <span className={cn(
      "relative z-10 text-sm tracking-wide font-medium uppercase transition-colors duration-200",
      isActive ? "text-white font-bold tracking-widest" : "text-gray-400 group-hover:text-white"
    )}>
      {name}
    </span>

    {/* Active Glow/Indicator - "Glitch" Effect */}
    {isActive && (
      <motion.div
        layoutId="sidebar-glitch"
        className="absolute inset-y-0 right-0 w-1 bg-[var(--acid-lime)]/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </motion.button>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useContext(HeaderContext);
  const userData = useSelector((state) => state?.auth?.userData);
  const [active, setActive] = useState("Home");
  const [subscriptions, setSubscriptions] = useState([]);
  const dispatch = useDispatch();


  // Fetch Subscriptions
  useEffect(() => {
    if (!userData) return;
    subscriptionService.getUserSubscription().then((res) => {
      if (res.status === 200) {
        setSubscriptions(res?.data?.data);
      }
    });
  }, [userData]);

  // Set Active Route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/Home")) setActive("Home");
    else if (path.includes("/subscription")) setActive("Subscriptions");
    else if (path.includes("/playlists")) setActive("Playlists");
    else if (path.includes("/History")) setActive("History");
    else if (path.includes("/liked-videos")) setActive("Liked");
    else if (path.includes("/Tweets")) setActive("Tweets");
    else if (path.includes("/createpost")) setActive("Create");
    else if (path.includes("/userVideos")) setActive("Content");
    else setActive("");
  }, [location.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const logOutHandler = async () => {
    try {
      authService.logout().then((res) => {
        if (res.status === 200) {
          dispatch(logout());
          navigate("/");
        }
      })

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Global CSS for variables (if not already in root) */}
      <style>{`
        :root {
          --acid-lime: #D4FF00;
          --void-black: #050505;
        }
        .font-display { font-family: 'Clash Display', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-[280px] flex flex-col shadow-2xl",
          "bg-[var(--void-black)] border-r border-white/10"
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0 bg-[#050505]">
          <div onClick={() => navigate("/")}>
            <Logo />
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-white hover:text-[var(--acid-lime)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-6">

          {/* Main Nav */}
          <div className="space-y-0.5">
            <div className="px-6 mb-3 text-[10px] font-mono uppercase text-white/30 tracking-widest">Menu</div>
            <MenuItem name="Home" icon={Home} path="/Home" isActive={active === "Home"} onClick={handleNavigation} />
            <MenuItem name="Feed" icon={LayoutGrid} path="/subscription" isActive={active === "Subscriptions"} onClick={handleNavigation} />
            <MenuItem name="Community" icon={Twitter} path="/Tweets" isActive={active === "Tweets"} onClick={handleNavigation} />
          </div>

          {/* Library Nav */}
          <div className="mt-8 space-y-0.5">
            <div className="px-6 mb-3 text-[10px] font-mono uppercase text-white/30 tracking-widest">Library</div>
            <MenuItem name="Upload" icon={Plus} path="/createpost" isActive={active === "Create"} onClick={handleNavigation} />
            <MenuItem name="Playlists" icon={Library} path="/playlists" isActive={active === "Playlists"} onClick={handleNavigation} />
            <MenuItem name="History" icon={History} path="/History" isActive={active === "History"} onClick={handleNavigation} />
            <MenuItem name="Liked" icon={ThumbsUp} path="/liked-videos" isActive={active === "Liked"} onClick={handleNavigation} />
            <MenuItem name="Studio" icon={Video} path="/userVideos" isActive={active === "Content"} onClick={handleNavigation} />
          </div>

          {/* Subscriptions */}
          <div className="mt-8 px-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest">Following</span>
              <span className="text-[10px] font-mono text-[var(--acid-lime)]">{subscriptions?.length || 0}</span>
            </div>

            <div className="space-y-2">
              {subscriptions && subscriptions.length > 0 ? (
                subscriptions.map((sub) => {
                  const info = sub.channelInfo?.[0];
                  if (!info) return null;

                  return (
                    <div
                      key={info.username}
                      onClick={() => handleNavigation(`/channel/${info.username}`)}
                      className="group flex items-center gap-3 cursor-pointer p-1 rounded-sm hover:bg-white/5 transition-colors"
                    >
                      <img
                        src={info.avatar || "https://via.placeholder.com/32"}
                        alt={info.fullname}
                        className="w-8 h-8 rounded-sm object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10 group-hover:border-[var(--acid-lime)]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-400 group-hover:text-white truncate transition-colors">
                          {info.fullname}
                        </p>
                      </div>
                      {/* Live Indicator Dot (Mock) */}
                      <div className="w-1.5 h-1.5 bg-gray-800 rounded-full group-hover:bg-[var(--acid-lime)] transition-colors" />
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-white/20 font-mono py-2 border border-white/5 p-2 text-center">
                  NO DATA FOUND
                </div>
              )}
            </div>
          </div>

          {/* Genres */}
          <div className="mt-8 mb-20 px-6">
            <div className="text-[10px] font-mono uppercase text-white/30 tracking-widest mb-3">Index</div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Docu", path: "/genre/documentary" },
                { name: "Film", path: "/genre/film" },
                { name: "Audio", path: "/genre/music" },
                { name: "Edu", path: "/genre/education" },
                { name: "Art", path: "/genre/art" },
              ].map((genre) => (
                <button
                  key={genre.name}
                  onClick={() => handleNavigation(genre.path)}
                  className="px-3 py-1.5 border border-white/10 hover:border-[var(--acid-lime)] hover:text-[var(--acid-lime)] text-white/50 text-[10px] uppercase font-bold tracking-wider transition-all hover:bg-[var(--acid-lime)]/5"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-white/10 bg-[#050505] shrink-0 z-10">
          {userData ? (
            <div className="bg-white/5 p-3 rounded-sm border border-white/5 hover:border-white/20 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={userData.avatar || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-10 h-10 rounded-sm object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                    {userData.fullname}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono truncate">
                    ID: {userData.username}
                  </p>
                </div>
              </div>

              <button
                onClick={logOutHandler}
                className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm"
              >
                <LogOut size={12} />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-3 p-3 border border-[var(--acid-lime)] text-[var(--acid-lime)] hover:bg-[var(--acid-lime)] hover:text-black transition-all group"
            >
              <User size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">System Login</span>
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}