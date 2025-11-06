import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import { MoreVertical, Pencil, ListPlus, Play, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../assets/download.jpeg';
import { timeAgo, formatVideoDuration } from '../TimeResolver.js';
import VideoSkeleton from '../VideoSkeleton.jsx';
import DeleteBtn from '../DeleteBtn.jsx';
import PlaylistOverlay from '../PlaylistOverlay.jsx';

function Media({ loading = false, data = [] }) {
  const content = useMemo(() => (loading ? Array.from(new Array(8)) : data), [loading, data]);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const userData = useSelector((state) => state?.auth?.userData);

  const handleMenuToggle = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const handleMenuClick = (action, id) => {
    if (action === 'Update') {
      navigate(`/editvideo/${id}`);
    } else {
      setVideoId(id);
      setOverlayOpen(true);
    }
    setMenuOpen(null);
  };

  const playlists = [
    { id: 1, name: 'My Favourites', videosCount: 12 },
    { id: 2, name: 'Watch Later', videosCount: 5 },
    { id: 3, name: 'Music Mix', videosCount: 20 },
  ];

  return (
    <>
      {overlayOpen && (
        <PlaylistOverlay
          playlists={playlists}
          videoId={videoId}
          onClose={() => setOverlayOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
        {content && content.length > 0 ? (
          content.map((item, index) => {
            const owner = item?.ownerInfo?.[0] || {};
            const isOwner = item?.owner === userData?._id;
            const isHovered = hoveredCard === item?._id;

            return (
              <div
                key={item?._id || index}
                className="group relative animate-fade-in-scale"
                style={{ animationDelay: `${index * 30}ms` }}
                onMouseEnter={() => setHoveredCard(item?._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glow effect background */}
                <div className="absolute -inset-1 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>

                {/* Main card */}
                <div className="relative bg-black rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105">
                  
                  {/* Thumbnail container */}
                  <div
                    className="relative w-full aspect-video overflow-hidden cursor-pointer bg-black"
                    onClick={() => item?._id && navigate(`/video/${item._id}`)}
                  >
                    {item ? (
                      <>
                        <img
                          src={item.thumbnail || defaultAvatar}
                          alt={item.title || 'video thumbnail'}
                          onError={(e) => (e.currentTarget.src = defaultAvatar)}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="relative">
                            <div className="relative bg-white/95 hover:bg-white rounded-full p-3 shadow-2xl transition-all duration-300 hover:scale-110">
                              <Play className="w-5 h-5 text-black fill-black" />
                            </div>
                          </div>
                        </div>

                        {/* Duration badge */}
                        {item?.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/90 text-white text-xs font-semibold rounded">
                            {formatVideoDuration(item.duration)}
                          </div>
                        )}

                        {/* Status indicator */}
                        {isOwner && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-black text-xs font-bold rounded">
                            YOUR VIDEO
                          </div>
                        )}
                      </>
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        sx={{ width: '100%', height: '100%', bgcolor: '#1a1a1a' }}
                      />
                    )}
                  </div>

                  {/* Content section */}
                  <div className="p-3">
                    <div className="flex gap-3 items-start">
                      {/* Channel avatar */}
                      {item ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/channel/${owner?.username}`);
                          }}
                          className="flex-shrink-0"
                        >
                          <img
                            src={owner?.avatar || defaultAvatar}
                            onError={(e) => (e.currentTarget.src = defaultAvatar)}
                            alt="channel avatar"
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        </button>
                      ) : (
                        <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: '#1a1a1a' }} />
                      )}

                      {/* Video info */}
                      <div className="flex-1 min-w-0">
                        {item ? (
                          <>
                            <h3
                              className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1 cursor-pointer hover:text-white/80 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/video/${item._id}`);
                              }}
                            >
                              {item.title || 'Untitled'}
                            </h3>

                            <button
                              className="text-xs text-white/60 hover:text-white/80 transition-colors text-left block mb-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/channel/${owner?.username}`);
                              }}
                            >
                              {owner?.fullname || owner?.username || 'Unknown Channel'}
                            </button>

                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{item.views ? `${item.views.toLocaleString()}` : '0'} views</span>
                              </div>
                              {item.createdAt && (
                                <>
                                  <span>•</span>
                                  <span>{timeAgo(item.createdAt)}</span>
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <Box sx={{ width: '100%' }}>
                            <Skeleton width="100%" height={16} sx={{ mb: 0.5, bgcolor: '#1a1a1a' }} />
                            <Skeleton width="70%" height={14} sx={{ mb: 0.5, bgcolor: '#1a1a1a' }} />
                            <Skeleton width="50%" height={12} sx={{ bgcolor: '#1a1a1a' }} />
                          </Box>
                        )}
                      </div>

                      {/* Options menu */}
                      {item && (
                        <div className="relative flex-shrink-0">
                          <button
                            onClick={(e) => handleMenuToggle(e, item._id)}
                            className="p-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
                          >
                            <MoreVertical
                              size={16}
                              className="text-white/60 hover:text-white transition-colors"
                            />
                          </button>

                          {menuOpen === item._id && (
                            <>
                              {/* Backdrop */}
                              <div
                                className="fixed inset-0 z-40"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpen(null);
                                }}
                              ></div>

                              {/* Menu */}
                              <div
                                className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden animate-scale-in"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {isOwner && (
                                  <>
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 transition-all duration-200">
                                      <DeleteBtn videoId={item._id} />
                                      <span>Delete Video</span>
                                    </button>
                                    <button
                                      onClick={() => handleMenuClick('Update', item._id)}
                                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 transition-all duration-200"
                                    >
                                      <Pencil size={16} />
                                      <span>Edit Video</span>
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleMenuClick('Add to Playlist', item._id)}
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 transition-all duration-200"
                                >
                                  <ListPlus size={16} />
                                  <span>Add to Playlist</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex items-center justify-center py-16">
            <VideoSkeleton count={8} />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.15s ease-out forwards;
        }
      `}</style>
    </>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
};

export default function VideoCard({ data, loading = false }) {
  return (
    <Box sx={{ p: 0, width: '100%' }}>
      <Media loading={loading} data={data} />
    </Box>
  );
}

VideoCard.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
};