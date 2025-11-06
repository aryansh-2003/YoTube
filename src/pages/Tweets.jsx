import React, { useContext, useEffect, useState } from "react";
import HeaderContext from "../components/context/HeaderContext";
import TweetComponent2 from "../components/TweetComponent2";
import { Sparkles } from "lucide-react";
import tweetService  from "../../Service/tweet";

export default function Tweets() {
  const [currentPage, setCurrentPage] = useState(1);
  const { sidebarOpen } = useContext(HeaderContext);
  const [tweets, setTweets] = useState()
  
  const tweetsPerPage = 10;

  useEffect(() => {
    tweetService.getAllTweets().then((res) => {
      console.log(res)
      if(res.status === 200 || 201){
        setTweets(res?.data?.data)
      }
    })
  },[])


  // Mock tweets data
  const allTweets = [
    {
      id: 1,
      name: "Sarah Chen",
      username: "sarahchen",
      verified: true,
      time: "2h",
      content: "Just deployed our new AI model to production! 🚀\n\nWent from 0 to 1M requests in the first hour. The team is absolutely crushing it. Sometimes you just need to ship and iterate.",
      likes: 3247,
      retweets: 521,
      replies: 89,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 2,
      name: "Marcus Johnson",
      username: "marcusj_dev",
      verified: true,
      time: "4h",
      content: "Hot take: The best code is the code you don't write.\n\nSpent 3 hours today deleting features nobody uses. Codebase is now 30% smaller and 2x faster. 💪",
      likes: 1829,
      retweets: 342,
      replies: 156,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 3,
      name: "Alex Rivera",
      username: "alexrivera",
      verified: false,
      time: "6h",
      content: "Teaching my first coding workshop today! 50 students, all eager to learn React.\n\nThe energy in the room is incredible. This is why I love tech education. ✨",
      likes: 892,
      retweets: 127,
      replies: 43,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 4,
      name: "Emma Watson",
      username: "emmawatson_tech",
      verified: true,
      time: "8h",
      content: "Reminder: Your mental health is more important than any deadline.\n\nTook a proper break today after months of grinding. Came back with fresh eyes and solved a bug in 10 minutes that haunted me for days. 🧠",
      likes: 5641,
      retweets: 1203,
      replies: 234,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 5,
      name: "David Kim",
      username: "davidkim_ui",
      verified: true,
      time: "12h",
      content: "New design system just dropped! 🎨\n\nSpent 6 months building this with the team. 200+ components, full accessibility, dark mode, and it's blazing fast. Open sourcing next week!",
      likes: 4123,
      retweets: 876,
      replies: 198,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 6,
      name: "Jessica Park",
      username: "jessicapark_",
      verified: true,
      time: "14h",
      content: "Finally cracked the performance issue that's been bugging us for weeks! 🎉\n\nTurns out it was a simple database index. Sometimes the solution is right in front of you.",
      likes: 1456,
      retweets: 234,
      replies: 67,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 7,
      name: "Ryan Martinez",
      username: "ryanmartinez",
      verified: false,
      time: "16h",
      content: "Started my first dev job today! 💼\n\nStill can't believe I'm getting paid to write code. Thank you to everyone who helped me on this journey.",
      likes: 2891,
      retweets: 445,
      replies: 312,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 8,
      name: "Olivia Brown",
      username: "oliviabrown_dev",
      verified: true,
      time: "18h",
      content: "Unpopular opinion: Documentation is more important than tests.\n\nGood docs prevent bugs. Great docs prevent entire classes of bugs. Write your docs first.",
      likes: 3567,
      retweets: 789,
      replies: 445,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 9,
      name: "James Wilson",
      username: "jameswilson",
      verified: false,
      time: "20h",
      content: "Refactored 5000 lines of code into 500. Feel like a wizard. 🧙‍♂️\n\nSometimes you need to take a step back and rebuild from scratch.",
      likes: 1234,
      retweets: 298,
      replies: 89,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 10,
      name: "Sophia Lee",
      username: "sophialee_tech",
      verified: true,
      time: "22h",
      content: "Just got accepted to speak at TechConf 2025! 🎤\n\nTopic: Building accessible web applications that don't compromise on design. See you there!",
      likes: 2145,
      retweets: 456,
      replies: 178,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 11,
      name: "Michael Chang",
      username: "michaelchang",
      verified: true,
      time: "1d",
      content: "Switched to Vim full-time. My productivity has... well, it's complicated. 😅\n\nBut I'm committed to mastering it!",
      likes: 987,
      retweets: 156,
      replies: 234,
      isLiked: false,
      isRetweeted: false
    },
    {
      id: 12,
      name: "Isabella Garcia",
      username: "isabellagarcia",
      verified: false,
      time: "1d",
      content: "Built my first Chrome extension today! 🎉\n\nIt automatically formats JSON in the browser. Simple but useful. Available on the Chrome Web Store now!",
      likes: 1678,
      retweets: 289,
      replies: 92,
      isLiked: false,
      isRetweeted: false
    }
  ];

  const totalPages = Math.ceil(allTweets.length / tweetsPerPage);
  const startIndex = (currentPage - 1) * tweetsPerPage;
  const endIndex = startIndex + tweetsPerPage;
  const currentTweets = allTweets.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={`relative min-h-screen text-white overflow-hidden bg-[#0a0a0a] ${sidebarOpen ? "blur-sm" : ""}`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-transparent to-zinc-900/20 pointer-events-none"></div>
      
      <div className="relative z-10 px-3 pt-8 sm:px-5 lg:px-8 w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700/50">
              <Sparkles className="w-6 h-6 text-zinc-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Tweets
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Discover the latest thoughts and updates from the community
          </p>
        </div>

        {/* Tweets Grid */}
        <div className="space-y-4 mb-8 items-center">
          {tweets ? tweets.map((tweet) => (
            <TweetComponent2 key={tweet.id} tweet={tweet} />
          )): ""}
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
              .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
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

        {/* Footer Info */}
        <div className="text-center text-sm text-zinc-500 pb-8">
          Page <span className="text-zinc-300 font-medium">{currentPage}</span> of{" "}
          <span className="text-zinc-300 font-medium">{totalPages}</span>
          {" • "}
          <span className="text-zinc-600">Showing {startIndex + 1}-{Math.min(endIndex, allTweets.length)} of {allTweets.length} tweets</span>
        </div>

        {/* Bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8"></div>
      </div>
    </main>
  );
}