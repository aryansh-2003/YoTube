import React, { useContext, useEffect, useState } from "react";
import HeaderContext from "../components/context/HeaderContext";
import TweetComponent2 from "../components/TweetComponent2";
import { Sparkles, Plus, X, MessageSquare, Heart } from "lucide-react";
import tweetService from "../../Service/tweet";
import LikedTweetComponent from "../components/LikedTweets";

export default function Tweets() {
  const [currentPage, setCurrentPage] = useState(1);
  const { sidebarOpen } = useContext(HeaderContext);
  const [tweets, setTweets] = useState();
  const [userlikedTweets, setUserLikedTweets] = useState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState();
  const [activeTab, setActiveTab] = useState("tweets"); // "tweets" or "liked"
  const tweetsPerPage = 10;

  const handleCreateTweet = async () => {
    if (!newTweetContent.trim()) return;

    setIsSubmitting(true);
    tweetService.createTweet({ message: newTweetContent }).then((res) => {
      if (res.status === 200) {
        setNewTweetContent("");
        setShowCreateModal(false);
        setIsSubmitting(false);
      }
    });
  };

  useEffect(() => {
    if (activeTab === "tweets") {
      tweetService.getAllTweets({ page: currentPage, limit: 10 }).then((res) => {
        if (res.status === 200 || 201) {
          setTweets(res?.data?.data?.Tweets);
          setTotal(res?.data?.data?.totalTweets);
        }
      });
    } else {
     tweetService.getAllLikedTweets().then((res) => {
      console.log(res)
      if(res.status === 200){
        setUserLikedTweets(res?.data?.data)
      }
     })
    }
  }, [isSubmitting, currentPage, activeTab]);

  const totalPages = total ? total : 2;
  const startIndex = (currentPage - 1) * tweetsPerPage;
  const endIndex = startIndex + tweetsPerPage;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  return (
    <main
      className={`relative min-h-screen text-white overflow-hidden bg-[#0a0a0a] ${
        sidebarOpen ? "blur-sm" : ""
      }`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-transparent to-zinc-900/20 pointer-events-none"></div>

      <div className="relative z-10 px-3 pt-8 sm:px-5 lg:px-8 w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700/50">
                <Sparkles className="w-6 h-6 text-zinc-400" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Tweets
              </h1>
            </div>
            {/* Create Tweet Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 border border-zinc-600/50 text-zinc-100 transition-all duration-200 shadow-lg shadow-zinc-900/50"
            >
              <Plus className="w-4 h-4" />
              <span>Create Tweet</span>
            </button>
          </div>
          <p className="text-zinc-500 text-sm">
            Discover the latest thoughts and updates from the community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800/50">
          <button
            onClick={() => handleTabChange("tweets")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === "tweets"
                ? "text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>All Tweets</span>
            {activeTab === "tweets" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-zinc-600 to-zinc-700"></div>
            )}
          </button>
          <button
            onClick={() => handleTabChange("liked")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
              activeTab === "liked"
                ? "text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Liked Tweets</span>
            {activeTab === "liked" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-zinc-600 to-zinc-700"></div>
            )}
          </button>
        </div>

        {/* Tweets Grid */}
        <div className="space-y-4 mb-8 items-center">
          {activeTab === "tweets" ? (
            tweets ? (
              tweets.map((tweet) => (
                <TweetComponent2 key={tweet.id} tweet={tweet} />
              ))
            ) : (
              <div className="text-center text-zinc-500 py-12">
                Loading tweets...
              </div>
            )
          ) : userlikedTweets ? (
            userlikedTweets.map((tweet) => (
                <TweetComponent2 key={tweet.id} tweet={tweet} />
            ))
          ) : (
            <div className="text-center text-zinc-500 py-12">
              <Heart className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
              <p className="text-lg font-medium text-zinc-400 mb-2">
                No liked tweets yet
              </p>
              <p className="text-sm">
                Tweets you like will appear here
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 py-8">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium border backdrop-blur-sm transition-all duration-200 ${
              currentPage === 1
                ? "border-zinc-800/50 text-zinc-600 cursor-not-allowed bg-zinc-900/30"
                : "border-zinc-700/50 text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-600/50"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[40px] h-10 px-3 flex items-center justify-center rounded-xl text-sm font-medium border backdrop-blur-sm transition-all duration-200 ${
                    page === currentPage
                      ? "bg-zinc-700/50 border-zinc-600/50 text-white shadow-lg shadow-zinc-900/50"
                      : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800/50 hover:border-zinc-700/50 hover:text-zinc-300"
                  }`}
                >
                  {page}
                </button>
              ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium border backdrop-blur-sm transition-all duration-200 ${
              currentPage === totalPages
                ? "border-zinc-800/50 text-zinc-600 cursor-not-allowed bg-zinc-900/30"
                : "border-zinc-700/50 text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-600/50"
            }`}
          >
            Next
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8"></div>
      </div>

      {/* Create Tweet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Create New Tweet
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <textarea
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full h-40 px-4 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700/50 resize-none"
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-zinc-500">
                  {newTweetContent.length}/280
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setNewTweetContent("");
                      setShowCreateModal(false);
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-700/50 text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTweet}
                    disabled={!newTweetContent.trim() || isSubmitting}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      !newTweetContent.trim() || isSubmitting
                        ? "bg-zinc-800/30 text-zinc-600 cursor-not-allowed border border-zinc-800/50"
                        : "bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 border border-zinc-600/50 text-zinc-100 shadow-lg shadow-zinc-900/50"
                    }`}
                  >
                    {isSubmitting ? "Posting..." : "Post Tweet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}