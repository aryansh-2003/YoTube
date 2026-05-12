import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { UserPlus, Heart, MessageSquare, Zap, ArrowRight } from "lucide-react";

export default function NotificationComponent({
  type = "follow", // 'Subscribe', 'Like', 'Comment'
  username = "unknown_entity",
  channelName,
  secondUser = null,
  message = "",
  time = "JUST NOW",
  userAvatar = "https://i.pravatar.cc/150?img=59",
  postImage = "https://picsum.photos/100/100",
  postId,
  onFollow,
}) {
  // --- CONFIGURATION: Icon & Accent Mapping ---
  const getMeta = () => {
    switch (type) {
      case "Subscribe":
        return {
          icon: <UserPlus size={16} />,
          label: "NEW_UPLINK",
          accent: "text-[#ccff00]", // Acid Lime
          border: "group-hover:border-[#ccff00]",
        };
      case "Like":
        return {
          icon: <Heart size={16} />,
          label: "SIGNAL_BOOST",
          accent: "text-pink-500", // Stark contrast for likes
          border: "group-hover:border-pink-500",
        };
      case "Comment":
        return {
          icon: <MessageSquare size={16} />,
          label: "DATA_INPUT",
          accent: "text-cyan-400", // Cyber Blue
          border: "group-hover:border-cyan-400",
        };
      default:
        return {
          icon: <Zap size={16} />,
          label: "SYSTEM_ALERT",
          accent: "text-white",
          border: "group-hover:border-white",
        };
    }
  };

  const meta = getMeta();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`
        group relative w-full flex items-start gap-4 p-4 mb-2
        bg-[#121216] border-l-2 border-white/5 ${meta.border}
        transition-all duration-300 hover:bg-[#1a1a20]
      `}
    >
      {/* 1. LEFT: Avatar & Status Indicator */}
      <div className="relative flex-shrink-0 pt-1">
        {/* Connection Line */}
        <div className="absolute top-8 bottom-0 left-1/2 w-px bg-white/5 -z-10 group-hover:bg-white/10" />
        
        <div className="relative">
          <Link to={`/channel/${channelName}`} className="block relative">
             {/* Tech Frame for Avatar */}
            <div className={`absolute -inset-1 border border-white/10 rounded-sm ${meta.accent} opacity-20 group-hover:opacity-100 transition-opacity duration-300`} />
            <img
              src={userAvatar}
              alt={username}
              className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 rounded-sm"
            />
          </Link>

          {/* Type Icon Badge */}
          <div className={`absolute -bottom-2 -right-2 bg-[#050507] border border-white/10 p-1 rounded-sm ${meta.accent}`}>
            {meta.icon}
          </div>
        </div>
      </div>

      {/* 2. CENTER: Data Stream Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Top Row: Meta Label & Time */}
        <div className="flex items-center gap-2 font-tech text-[10px] tracking-widest text-gray-500 uppercase">
          <span className={meta.accent}>{meta.label}</span>
          <span className="text-gray-700">//</span>
          <span>{time}</span>
        </div>

        {/* Content Row */}
        <div className="text-sm md:text-base leading-snug">
          <Link 
            to={`/channel/${channelName}`}
            className="font-display font-bold text-[#e2e2e2] hover:text-[#ccff00] transition-colors uppercase mr-1.5 inline-block border-b border-transparent hover:border-[#ccff00]"
          >
            {username}
          </Link>
          
          {secondUser && type === "Like" && (
             <span className="font-tech text-xs text-gray-400 mx-1">
               + {secondUser} OTHERS
             </span>
          )}

          <span className="font-tech text-gray-400 text-xs md:text-sm">
            {type === "Subscribe" && "initialized a connection."}
            {type === "Like" && "acknowledged this entry."}
            {type === "Comment" && (
              <>
                appended data: <span className="text-white italic">"{message}"</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 3. RIGHT: Action / Payload Preview */}
      <div className="flex-shrink-0 self-center pl-2">
        {type === "Subscribe" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onFollow) onFollow();
            }}
            className="
              relative overflow-hidden px-4 py-2 bg-transparent border border-[#ccff00] 
              text-[#ccff00] font-tech text-xs font-bold uppercase tracking-widest
              hover:bg-[#ccff00] hover:text-black transition-all duration-300
              group/btn
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              Sync <UserPlus size={12} />
            </span>
          </button>
        ) : (
          <Link to={`/video/${postId}`} className="block relative group/thumb">
            <div className="absolute inset-0 border border-white/20 z-10 group-hover/thumb:border-[#ccff00] transition-colors" />
            <img
              src={postImage}
              alt="Context"
              className="w-16 h-10 object-cover filter sepia-[.5] group-hover/thumb:sepia-0 transition-all duration-300"
            />
            {/* Play overlay for video types */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
              <ArrowRight size={12} className="text-[#ccff00]" />
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
} 