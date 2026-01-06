import React, { useContext, useEffect, useState } from "react";
import HeaderContext from "../components/context/HeaderContext";
import TweetComponent2 from "../components/TweetComponent2";
import LikedTweetComponent from "../components/LikedTweets"; // Assuming you might use this or just TweetComponent2
import tweetService from "../../Service/tweet";
import {
  Sparkles,
  Plus,
  X,
  MessageSquare,
  Heart,
  TrendingUp,
  BarChart3,
  Search,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Sub-Components for UI Polish ---

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="w-full p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm animate-pulse">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/4 bg-zinc-800 rounded" />
            <div className="h-16 w-full bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RightSidebar = ({ totalTweets }) => (
  <div className="hidden lg:block space-y-6">
    {/* Stats Card */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-black border border-zinc-800/60 backdrop-blur-md"
    >
      <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4">Community Stats</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-300 font-medium">Total Tweets</span>
        <span className="text-2xl font-bold text-white">{totalTweets || 0}</span>
      </div>
      <div className="w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full w-3/4 rounded-full" />
      </div>
    </motion.div>

    {/* Trending Topics (Static/Mock for design filling) */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" /> Trending
      </h3>
      <div className="space-y-4">
        {["#ReactJS", "#WebDev", "#DesignSystem", "#TechLife"].map((tag, i) => (
          <div key={i} className="flex justify-between items-center group cursor-pointer">
            <div>
              <p className="text-sm font-bold text-zinc-300 group-hover:text-blue-400 transition-colors">{tag}</p>
              <p className="text-xs text-zinc-500">1.2k tweets</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </motion.div>
    
    <div className="text-xs text-zinc-600 px-2 text-center">
      &copy; 2025 TweetApp Inc. Privacy • Terms
    </div>
  </div>
);

export default function Tweets() {
  const { sidebarOpen } = useContext(HeaderContext);
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [tweets, setTweets] = useState([]);
  const [userlikedTweets, setUserLikedTweets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("tweets");
  
  const tweetsPerPage = 10;

  // --- Handlers ---

  const handleCreateTweet = async () => {
    if (!newTweetContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await tweetService.createTweet({ message: newTweetContent });
      if (res.status === 200) {
        setNewTweetContent("");
        setShowCreateModal(false);
        // Reset to page 1 to see new tweet
        if (currentPage === 1) {
             // Force refresh logic or depend on isSubmitting in useEffect
        } else {
            setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error("Error creating tweet", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "tweets") {
          const res = await tweetService.getAllTweets({ page: currentPage, limit: tweetsPerPage });
          if (res.status === 200 || res.status === 201) {
            setTweets(res?.data?.data?.Tweets || []);
            setTotal(res?.data?.data?.totalTweets || 0);
          }
        } else {
          const res = await tweetService.getAllLikedTweets();
          if (res.status === 200) {
            setUserLikedTweets(res?.data?.data || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setTimeout(() => setIsLoading(false), 500); // Small artificial delay for smooth animation
      }
    };

    fetchData();
  }, [currentPage, activeTab, isSubmitting]); // Added isSubmitting to refresh after post

  const totalPages = total ? Math.ceil(total / tweetsPerPage) : 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main
      className={`relative min-h-screen text-white bg-black transition-all duration-300 ${
        sidebarOpen ? "blur-sm opacity-50 overflow-hidden" : ""
      }`}
    >
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[0%] right-[-10%] w-[30rem] h-[30rem] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Feed) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/60 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800/50 shadow-2xl">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                  Tweets
                </h1>
                <p className="text-zinc-500 text-sm mt-1">Join the conversation</p>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>New Tweet</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/50 sticky top-4 z-30 shadow-lg">
              {['tweets', 'liked'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    activeTab === tab ? "text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-zinc-800 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2 capitalize">
                    {tab === 'tweets' ? <MessageSquare className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                    {tab === 'tweets' ? 'All Tweets' : 'Liked'}
                  </span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {activeTab === "tweets" ? (
                    tweets && tweets.length > 0 ? (
                      tweets.map((tweet) => (
                        <motion.div key={tweet.id} variants={itemVariants} layout>
                          <TweetComponent2 tweet={tweet} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>No tweets found.</p>
                      </div>
                    )
                  ) : userlikedTweets && userlikedTweets.length > 0 ? (
                    userlikedTweets.map((tweet) => (
                      <motion.div key={tweet.id} variants={itemVariants} layout>
                         {/* Ensure TweetComponent2 handles displayed data correctly */}
                         <TweetComponent2 tweet={tweet} /> 
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-zinc-900/20 rounded-3xl border border-zinc-800/50 border-dashed">
                      <Heart className="w-16 h-16 mb-4 opacity-20 text-red-500" />
                      <p className="text-lg">No liked tweets yet</p>
                      <button onClick={() => handleTabChange('tweets')} className="text-blue-500 hover:underline mt-2 text-sm">Browse tweets</button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            {activeTab === 'tweets' && total > 0 && (
              <div className="flex justify-between items-center bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-zinc-500">
                  Page <span className="text-white">{currentPage}</span> of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 pl-4">
            <RightSidebar totalTweets={total} />
          </div>

        </div>
      </div>

      {/* Modal - AnimatePresence ensures exit animation works */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              
              <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-xl font-bold text-white">Draft Tweet</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 pt-2">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <textarea
                      value={newTweetContent}
                      onChange={(e) => setNewTweetContent(e.target.value)}
                      placeholder="What is happening?!"
                      className="w-full min-h-[150px] bg-transparent text-lg text-white placeholder-zinc-500 focus:outline-none resize-none"
                      maxLength={280}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-blue-500">
                    {/* Decorative Icons */}
                    <button className="hover:bg-blue-500/10 p-2 rounded-full transition-colors"><div className="w-4 h-4 border border-current rounded-sm" /></button>
                    <button className="hover:bg-blue-500/10 p-2 rounded-full transition-colors"><div className="w-4 h-4 border border-current rounded-full" /></button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-xs ${newTweetContent.length > 260 ? "text-red-500" : "text-zinc-500"}`}>
                      {newTweetContent.length}/280
                    </span>
                    <button
                      onClick={handleCreateTweet}
                      disabled={!newTweetContent.trim() || isSubmitting}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                        !newTweetContent.trim() || isSubmitting
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Posting
                        </span>
                      ) : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}