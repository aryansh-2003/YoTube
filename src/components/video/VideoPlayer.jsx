import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, 
  SkipForward, SkipBack, Captions, PictureInPicture, MonitorPlay 
} from 'lucide-react';
import { useParams } from 'react-router';

// Video Player Component
export default function VideoPlayer({ onVideoEnd, videoInfo, currentVideo }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null); // New ref for fullscreen container
  const { videoId } = useParams();
  const progressRef = useRef(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [videoData, setvideoData] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);

  useEffect(() => {
    setvideoData(currentVideo);
    
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

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('progress', updateBuffer);
    video.addEventListener('ended', handleEnd);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('progress', updateBuffer);
      video.removeEventListener('ended', handleEnd);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onVideoEnd, currentVideo]);

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
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume || 1;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
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
    if (!time && time !== 0) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Custom CSS for the volume range slider
  const sliderStyle = `
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: #ffffff;
      cursor: pointer;
      margin-top: -4px;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
    }
  `;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black group overflow-hidden shadow-xl ${!isFullscreen ? 'rounded-xl' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <style>{sliderStyle}</style>

      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full aspect-video object-contain bg-black"
        src={videoData?.videoFile}
        poster={videoData?.thumbnail}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />
      
      {/* Loading / Buffering State (Optional placeholder) */}
      {/* Center Play Button Animation */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-full border border-white/10">
             <Play size={20} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Gradient Overlay for Controls */}
      <div 
        className={`absolute inset-x-0 bottom-0 z-20 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Bottom Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none h-32 mt-auto" />

        {/* Controls Container */}
        <div className="relative px-3 pb-3 pt-10 flex flex-col gap-2">
          
          {/* Progress Bar Container */}
          <div 
            className="relative w-full h-1 group/progress cursor-pointer flex items-center"
            ref={progressRef}
            onClick={handleProgressClick}
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
          >
             {/* Hover Area (invisible thick line for easier clicking) */}
             <div className="absolute w-full h-4 bg-transparent -top-1.5 z-30"></div>

            {/* Background Track */}
            <div className="absolute w-full h-1 bg-white/30 rounded-full group-hover/progress:h-1.5 transition-all duration-200" />
            
            {/* Buffered Bar */}
            <div 
              className="absolute h-1 bg-white/40 rounded-full group-hover/progress:h-1.5 transition-all duration-200"
              style={{ width: `${(bufferedTime / duration) * 100 || 0}%` }}
            />
            
            {/* Current Progress - GOLD COLOR from image */}
            <div 
              className="absolute h-1 bg-[#E1AD01] rounded-full group-hover/progress:h-1.5 transition-all duration-200 z-10"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            >
              {/* Scrubber Knob */}
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#E1AD01] rounded-full shadow-md transform scale-0 group-hover/progress:scale-100 transition-transform duration-200 ${isHoveringProgress ? 'scale-100' : ''}`} />
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between z-20 mt-1">
            
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => skipTime(-10)} 
                className="text-white/80 hover:text-white transition-colors hidden sm:block"
              >
                <SkipBack size={20} />
              </button>

              <button onClick={togglePlay} className="text-white hover:text-[#E1AD01] transition-colors">
                {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20}  />}
              </button>

              <button 
                onClick={() => skipTime(10)} 
                className="text-white/80 hover:text-white transition-colors hidden sm:block"
              >
                <SkipForward size={20} />
              </button>

              {/* Volume Group */}
              <div className="flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="text-white hover:text-white transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 ease-out flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#E1AD01]"
                  />
                </div>
              </div>

              <div className="text-xs font-medium text-white/90 select-none font-sans">
                {formatTime(currentTime)} <span className="text-white/50">/</span> {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              
              {/* AutoPlay Switch Visual */}
              <div className="hidden md:flex items-center gap-2 group cursor-pointer opacity-80 hover:opacity-100">
                <div className="w-9 h-5 bg-white/20 rounded-full relative p-0.5 border border-white/10">
                   <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <button className="text-white/80 hover:text-white transition-colors hidden sm:block">
                <Captions size={20} strokeWidth={2} />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className={`transition-transform duration-300 ${showSettings ? 'rotate-90 text-white' : 'text-white/80 hover:text-white'}`}
                >
                  <Settings size={20} />
                </button>
                
                {/* Settings Menu Popup */}
                {showSettings && (
                   <div className="absolute bottom-10 right-0 bg-black/90 border border-white/10 rounded-xl p-2 min-w-[160px] shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                     <div className="px-3 py-2 text-xs font-semibold text-white/50 border-b border-white/10 mb-1">Playback Speed</div>
                     {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                       <button
                         key={rate}
                         onClick={() => changePlaybackRate(rate)}
                         className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                           playbackRate === rate ? 'bg-white/10 text-[#E1AD01]' : 'text-white hover:bg-white/10'
                         }`}
                       >
                         <span>{rate === 1 ? 'Normal' : rate + 'x'}</span>
                         {playbackRate === rate && <span className="w-1.5 h-1.5 bg-[#E1AD01] rounded-full"></span>}
                       </button>
                     ))}
                   </div>
                )}
              </div>

              <button className="text-white/80 hover:text-white transition-colors hidden sm:block">
                 <PictureInPicture size={20} />
              </button>

              <button className="text-white/80 hover:text-white transition-colors hidden sm:block">
                 <MonitorPlay size={20} />
              </button>

              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-white transition-transform hover:scale-110"
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}