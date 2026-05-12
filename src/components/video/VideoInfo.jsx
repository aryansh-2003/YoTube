import { useEffect, useState } from "react";
import { Share, Download, Pencil, Shell } from 'lucide-react';
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-transparent text-slate-900 space-y-5 relative font-sans"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-xl sm:text-2xl font-extrabold leading-tight text-slate-900 tracking-tight"
      >
        {videoData?.title || "Loading..."}
      </motion.h1>
      
      {/* Channel Info & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        {/* Left Side: Channel Info */}
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
              <DisplayPic children={videoData?.ownerInfo?.[0]} />
            </div>
          </motion.div>

          <div className="flex-1 min-w-0 pr-4">
            <motion.p
              whileHover={{ x: 2 }}
              onClick={() => navigate(`/channel/${videoData?.ownerInfo?.[0]?.username}`)}
              className="font-bold text-base text-slate-900 cursor-pointer hover:text-[#ff0000] transition-colors truncate"
            >
              {videoData?.ownerInfo?.[0]?.fullname || "Unknown User"}
            </motion.p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {videoData?.channel?.subscribers || 0} subscribers
            </p>
          </div>

          {/* Subscribe Button wrapper */}
          <div className="shrink-0">
             <SubscribeButton isSubscribed={isSubscribed} id={videoData?.ownerInfo?.[0]?._id} />
          </div>
        </div>
        
        {/* Right Side: Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center space-x-2 w-full sm:w-auto flex-wrap gap-y-2"
        >
          {/* Like Button */}
          <div className="bg-slate-100 rounded-full flex items-center shadow-sm border border-slate-200/50">
             <LikeButton videoInfo={videoData} />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center space-x-2 bg-slate-100 border border-slate-200/50 text-slate-700 px-4 py-2 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all font-semibold shadow-sm"
          >
            <Share size={18} strokeWidth={2.5} />
            <span className="text-sm">Share</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center space-x-2 bg-slate-100 border border-slate-200/50 text-slate-700 px-4 py-2 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all font-semibold shadow-sm"
          >
            <Download size={18} strokeWidth={2.5} />
            <span className="text-sm">Download</span>
          </motion.button>

          {/* Author Actions */}
          {isAuthor && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 ml-2 pl-2 border-l border-slate-200"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <DeleteBtn videoId={videoData ? videoData._id : ""} />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/editvideo/${videoData._id}`)}
                  className="bg-blue-50 border border-blue-100 text-blue-600 p-2.5 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
                  title="Edit Video"
                >
                  <Pencil size={18} strokeWidth={2.5} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPublishStatus(!publishStatus);
                    publishStatusHandler();
                  }}
                  className={`p-2.5 rounded-full border transition-all shadow-sm ${
                    publishStatus 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' 
                    : 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
                  }`}
                  title={publishStatus ? "Published (Click to unpublish)" : "Unpublished (Click to publish)"}
                >
                  <Shell size={18} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
      
      {/* Description Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-slate-100/80 p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all group"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[13px] font-bold text-slate-800 mb-2"
        >
          {videoData?.views?.toLocaleString() || 0} views <span className="mx-1 text-slate-400">•</span> {date ? date.toLocaleDateString() : ""}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={showDescription ? 'expanded' : 'collapsed'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-sm text-slate-700 leading-relaxed font-medium ${showDescription ? '' : 'line-clamp-3'}`}
          >
            {videoData?.description?.split('\n').map((line, index) => (
              <p key={index} className="mb-1">
                {line}
              </p>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={() => setShowDescription(!showDescription)}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm font-bold mt-2 text-slate-500 hover:text-[#ff0000] transition-colors uppercase tracking-wider text-[11px]"
        >
          {showDescription ? 'Show less' : 'Show more'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}