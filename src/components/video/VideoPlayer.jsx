import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, MoreHorizontal, ThumbsUp, ThumbsDown, Share, Download, Flag, SkipBack, SkipForward, Repeat, Shuffle, Menu, Search, Bell, User } from 'lucide-react';
import VideoService  from '../../../Service/video';
import { useParams } from 'react-router';

// Video Player Component
export default function VideoPlayer({ onVideoEnd ,videoInfo,currentVideo}){

  const videoRef = useRef(null);
  const {videoId} = useParams()
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [videoData, setvideoData] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [bufferedTime, setBufferedTime] = useState(0);

  useEffect(() => {

      const videoinfo = currentVideo;
      setvideoData(videoinfo)

    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updateBuffer = () => {
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(video.buffered.length - 1));
      }
    };
    const handleEnd = () => {
      setIsPlaying(false);
      if (onVideoEnd) onVideoEnd();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('progress', updateBuffer);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('progress', updateBuffer);
      video.removeEventListener('ended', handleEnd);
    };
  }, [onVideoEnd]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const newTime = (clickX / progressWidth) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden group w-full shadow-2xl border border-orange-500/20">
      {/* Anime decorative elements */}
      <div className="absolute top-2 right-2 text-2xl opacity-30 pointer-events-none z-10">🍥</div>
      <div className="absolute bottom-20 left-2 text-xl opacity-20 pointer-events-none z-10">⚡</div>
      
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #f97316, #ec4899);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #f97316, #ec4899);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(249, 115, 22, 0.5);
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.6); }
        }
      `}</style>

      <video
        ref={videoRef}
        className="w-full h-full aspect-video object-contain"
        src={videoData?.videoFile}
        poster={videoData?.thumbnail}
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onDoubleClick={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            videoRef.current.requestFullscreen();
          }
        }}
      />
      
      {/* Play Button Overlay - Anime Style */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <button
              onClick={togglePlay}
              className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-full p-4 transition-all transform hover:scale-110 shadow-lg border-2 border-orange-400/50"
              style={{ animation: 'pulse-glow 2s infinite' }}
            >
              <Play size={28} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {/* Video Controls - Anime Themed */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Progress Bar - Anime Style */}
        <div className="px-3 pb-2">
          <div 
            ref={progressRef}
            className="relative h-1 bg-slate-700/50 rounded-full cursor-pointer hover:h-1.5 transition-all group backdrop-blur-sm"
            onClick={handleProgressClick}
          >
            {/* Buffer Bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-slate-600/60 rounded-full"
              style={{ width: `${(bufferedTime / duration) * 100 || 0}%` }}
            />
            {/* Progress Bar - Gradient */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-lg"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
            {/* Progress Handle */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-white/30"
              style={{ left: `${(currentTime / duration) * 100 || 0}%`, marginLeft: '-6px' }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center space-x-2">
            <button 
              onClick={togglePlay} 
              className="text-white hover:text-orange-400 transition-colors p-1.5 hover:bg-slate-800/50 rounded-lg"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            
            <button 
              onClick={() => skipTime(-10)} 
              className="text-white hover:text-orange-400 transition-colors hidden sm:block p-1.5 hover:bg-slate-800/50 rounded-lg"
            >
              <SkipBack size={16} />
            </button>
            
            <button 
              onClick={() => skipTime(10)} 
              className="text-white hover:text-orange-400 transition-colors hidden sm:block p-1.5 hover:bg-slate-800/50 rounded-lg"
            >
              <SkipForward size={16} />
            </button>
            
            <div className="flex items-center space-x-2 group">
              <button 
                onClick={toggleMute} 
                className="text-white hover:text-orange-400 transition-colors p-1.5 hover:bg-slate-800/50 rounded-lg"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <div className="w-0 group-hover:w-16 transition-all duration-200 overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
            
            <span className="text-white text-xs hidden sm:block font-semibold px-2 py-1 bg-slate-800/50 rounded-lg border border-orange-500/20">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-orange-400 transition-colors hidden sm:block p-1.5 hover:bg-slate-800/50 rounded-lg"
              >
                <Settings size={16} />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-orange-500/30 rounded-xl p-2 min-w-32 shadow-xl backdrop-blur-md">
                  <div className="text-orange-400 text-xs mb-2 font-bold">Playback Speed</div>
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-2 py-1 text-xs hover:bg-slate-800/80 rounded-lg transition-colors ${
                        playbackRate === rate ? 'text-orange-400 font-bold bg-slate-800/50' : 'text-white'
                      }`}
                    >
                      {rate}x {rate === 1 && '(Normal)'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => videoRef.current.requestFullscreen()}
              className="text-white hover:text-orange-400 transition-colors p-1.5 hover:bg-slate-800/50 rounded-lg"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};