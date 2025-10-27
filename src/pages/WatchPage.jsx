import React, { useContext, useEffect, useState } from "react";
import VideoPlayer from "../components/video/VideoPlayer";
import VideoInfo from "../components/video/VideoInfo";
import CommentsSection from "../components/CommentsSection";
import SidebarVideos from "../components/video/SidebarVideos";
import HeaderContext from "../components/context/HeaderContext";
import VideoService from "../../Service/video";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { vdo } from "../Store/videoSlice";

const WatchPage = () => {
  const { sidebarOpen } = useContext(HeaderContext);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const videoData = useSelector(state => state?.video?.videoData?.[0]);

  useEffect(() => {
    if (!videoId) return;
    const load = async () => {
      try {
        const resp = await VideoService.getVideoById({ id: videoId });
        if (resp.status === 200 || resp.status === 201) {
          dispatch(vdo(resp.data.data));
          const info = resp.data.data[0];
          setCurrentVideo(info);
        } else {
          setCurrentVideo(null);
        }
      } catch (err) {
        console.error(err);
        setCurrentVideo(null);
      }
    };

    if (videoData && videoData._id === videoId) {
      setCurrentVideo(videoData);
    } else {
      load();
    }
  }, [videoId, videoData, dispatch]);

  const handleAddComment = (comment) => {
    setComments(prev => [comment, ...prev]);
  };

  return (
    <div className="flex-1 min-h-screen p-2 text-white relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
      {/* Animated falling sakura petals - Behind content */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300 opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              fontSize: `${Math.random() * 15 + 15}px`,
              animation: `fall ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            🌸
          </div>
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="absolute text-orange-400 opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              fontSize: `${Math.random() * 12 + 12}px`,
              animation: `fall ${Math.random() * 12 + 18}s linear infinite`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          >
            🍂
          </div>
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`petal2-${i}`}
            className="absolute text-purple-300 opacity-35"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              fontSize: `${Math.random() * 12 + 10}px`,
              animation: `fall ${Math.random() * 14 + 16}s linear infinite`,
              animationDelay: `${Math.random() * 7}s`,
            }}
          >
            🌺
          </div>
        ))}
      </div>

      {/* Katana decorations */}
      <div className="fixed top-1/4 left-5 opacity-10 pointer-events-none z-30" style={{ animation: 'rotate-slow 20s linear infinite' }}>
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <line x1="10" y1="90" x2="90" y2="10" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
          <line x1="15" y1="85" x2="85" y2="15" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="15" cy="85" r="5" fill="#fbbf24"/>
        </svg>
      </div>
      <div className="fixed bottom-1/4 right-10 opacity-10 pointer-events-none z-30" style={{ animation: 'rotate-slow 25s linear infinite reverse' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <line x1="20" y1="10" x2="80" y2="90" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
          <line x1="25" y1="15" x2="75" y2="85" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="10" r="5" fill="#f472b6"/>
        </svg>
      </div>

      {/* Demon Slayer pattern background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(249, 115, 22, 0.1) 35px, rgba(249, 115, 22, 0.1) 70px)`,
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="fixed top-20 left-1/4 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse pointer-events-none z-10"></div>
      <div className="fixed bottom-40 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none z-10" style={{ animation: 'pulse 3s ease-in-out infinite' }}></div>
      <div className="fixed top-1/2 left-10 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-10" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>

      <style>{`
        @keyframes fall {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(-5deg);
          }
          50% { 
            transform: translateY(-25px) rotate(5deg);
          }
        }
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.1;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.15;
          }
        }
      `}</style>

      <div className="relative z-10 mx-auto px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
        {/* Mobile first view */}
        <div className="block lg:hidden space-y-6">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full shadow-lg shadow-orange-500/50"></div>
          
          <VideoPlayer
            currentVideo={currentVideo}
            onVideoEnd={() => console.log("Video ended")}
          />
          
          <VideoInfo videoData={currentVideo} />
          
          {/* Up Next Section - Mobile */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl border-2 border-orange-500/30 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl animate-pulse">🔥</div>
                <h3 className="text-white font-bold text-lg bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Up Next
                </h3>
                <div className="text-xl">⚔️</div>
              </div>
              <SidebarVideos query={currentVideo?.title || ""} />
            </div>
          </div>
          
          {/* Comments Section - Mobile */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-4 shadow-2xl">
              <CommentsSection
                video={currentVideo}
                comments={comments}
                onAddComment={handleAddComment}
              />
            </div>
          </div>
        </div>

        {/* Desktop / large screen */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Decorative top border */}
          <div className="lg:col-span-3 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full shadow-lg shadow-orange-500/50 mb-4"></div>
          
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              currentVideo={currentVideo}
              onVideoEnd={() => console.log("Video ended")}
            />
            
            <VideoInfo videoData={currentVideo} />
            
            {/* Comments Section - Desktop */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-5 shadow-2xl">
                <CommentsSection
                  video={currentVideo}
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl border-2 border-orange-500/30 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="text-xl animate-pulse">🔥</div>
                    <h3 className="text-white font-bold text-base bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Up Next
                    </h3>
                    <div className="text-lg">⚔️</div>
                  </div>
                  <SidebarVideos query={currentVideo?.title || ""} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;