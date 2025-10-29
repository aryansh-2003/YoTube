import { useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, MoreHorizontal, ThumbsUp, ThumbsDown, Share, Download, Flag, SkipBack, SkipForward, Repeat, Shuffle, Menu, Search, Bell, User, Trash, Pencil, Shell } from 'lucide-react';
import DisplayPic from '../DisplayPic';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from 'framer-motion';
import videoService from '../../../Service/video';
import LikeButton from '../Like';
import DeleteBtn from '../DeleteBtn';
import SubscribeButton from "../SubscribeButton";

export default function VideoInfo({ videoData }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const date = new Date(videoData ? videoData?.createdAt : null);
  const userData = useSelector(state => state?.auth?.userData);
  const isAuthor = videoData && userData ? videoData?.ownerInfo?.[0]?._id == userData._id : false;
  const [publishStatus, setPublishStatus] = useState();

  useEffect(() => {
    if (!videoData) return;
    setPublishStatus(videoData?.isPublished);
    setIsLiked(videoData?.isLiked);
    setIsSubscribed(videoData?.ownerInfo?.[0]?.isSubscribed);
  }, [videoData]);
  
  const publishStatusHandler = () => {
    videoService.changePublishStatus({ id: videoData._id, status: !publishStatus }).then((res) => {
      setPublishStatus(!publishStatus);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-transparent text-white space-y-4 relative"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            x: [0, 50, 0],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight"
      >
        {videoData?.title}
      </motion.h1>
      
      {/* Channel Info & Subscribe */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div className="flex items-center space-x-4">
          {/* Avatar with effects */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            {/* Pulsing ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-violet-500/30 blur-md -z-10"
            />
            
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full -z-10"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)",
                padding: "2px",
              }}
            />
            
            <DisplayPic children={videoData?.ownerInfo?.[0]} />
          </motion.div>

          <div className="flex-1">
            <motion.p
              whileHover={{ x: 2 }}
              className="font-semibold w-full text-sm sm:text-base cursor-pointer hover:text-violet-400 transition-colors"
            >
              {videoData?.ownerInfo?.[0]?.fullname}
            </motion.p>
            <p className="text-xs sm:text-sm text-gray-400">
              {videoData?.channel?.subscribers}
            </p>
          </div>

          <SubscribeButton isSubscribed={isSubscribed} id={videoData?.ownerInfo?.[0]?._id} />
        </div>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center space-x-2 w-full sm:w-auto flex-wrap gap-2"
        >
          <LikeButton videoInfo={videoData} />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full hover:bg-gray-700/50 transition-all relative group overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <Share size={16} className="relative z-10" />
            <span className="text-sm hidden sm:inline relative z-10">Share</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full hover:bg-gray-700/50 transition-all relative group overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <Download size={16} className="relative z-10" />
            <span className="text-sm hidden sm:inline relative z-10">Download</span>
          </motion.button>

          {isAuthor && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <DeleteBtn videoId={videoData ? videoData._id : ""} />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/editvideo/${videoData._id}`)}
                  className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700/50 transition-all relative group"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-500/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <Pencil size={16} className="relative z-10" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPublishStatus(!publishStatus);
                    publishStatusHandler();
                  }}
                  className={`bg-gray-800/50 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700/50 transition-all relative ${
                    publishStatus ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`absolute inset-0 rounded-full blur-md ${
                      publishStatus ? 'bg-green-500/30' : 'bg-red-500/30'
                    }`}
                  />
                  <Shell size={16} className="relative z-10" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
      
      {/* Description Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl relative group overflow-hidden border border-white/5 hover:border-white/10 transition-all"
      >
        {/* Subtle hover glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-300 mb-2 relative z-10"
        >
          views : {videoData?.views} • {date ? date.toLocaleTimeString() : ""}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={showDescription ? 'expanded' : 'collapsed'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-sm leading-relaxed relative z-10 ${showDescription ? '' : 'line-clamp-3'}`}
          >
            {videoData?.description?.split('\n').map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="mb-1"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={() => setShowDescription(!showDescription)}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm font-medium mt-2 hover:underline transition-all relative z-10 hover:text-violet-400"
        >
          {showDescription ? 'Show less' : 'Show more'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}