
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
    <div className="relative bg-black rounded-xl overflow-hidden group w-full">
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
      
      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-all transform hover:scale-110"
          >
            <Play size={32} fill="currentColor" />
          </button>
        </div>
      )}

      {/* Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <div 
            ref={progressRef}
            className="relative h-1 bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all group"
            onClick={handleProgressClick}
          >
            {/* Buffer Bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-gray-400 rounded-full"
              style={{ width: `${(bufferedTime / duration) * 100 || 0}%` }}
            />
            {/* Progress Bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
            {/* Progress Handle */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100 || 0}%`, marginLeft: '-6px' }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center space-x-3">
            <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              onClick={() => skipTime(-10)} 
              className="text-white hover:text-gray-300 transition-colors hidden sm:block"
            >
              <SkipBack size={18} />
            </button>
            
            <button 
              onClick={() => skipTime(10)} 
              className="text-white hover:text-gray-300 transition-colors hidden sm:block"
            >
              <SkipForward size={18} />
            </button>
            
            <div className="flex items-center space-x-2 group">
              <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="w-0 group-hover:w-16 transition-all duration-200 overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
            
            <span className="text-white text-sm hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-gray-300 transition-colors hidden sm:block"
              >
                <Settings size={18} />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-32">
                  <div className="text-white text-xs mb-2">Playback Speed</div>
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-2 py-1 text-xs hover:bg-gray-700 rounded ${
                        playbackRate === rate ? 'text-red-500' : 'text-white'
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
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
