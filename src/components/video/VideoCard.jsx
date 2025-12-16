import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import { MoreVertical, Pencil, ListPlus, Play, CheckCircle2, PlayCircle, PlayCircleIcon } from 'lucide-react';
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

      {/* Grid Layout matches Home.js structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 w-full">
        {content && content.length > 0 ? (
          content.map((item, index) => {
            const owner = item?.ownerInfo?.[0] || {};
            const isOwner = item?.owner === userData?._id;

            return (
              <div
                key={item?._id || index}
                className="group flex flex-col gap-3 cursor-pointer"
                onMouseEnter={() => setHoveredCard(item?._id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => item?._id && navigate(`/video/${item._id}`)}
              >
                {/* --- Thumbnail Section --- */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]">
                  {item ? (
                    <>
                      <img
                        src={item.thumbnail || defaultAvatar}
                        alt={item.title || 'video thumbnail'}
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Dark Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* "YOUR VIDEO" Badge - Matches Image (Gold/Yellow) */}
                      {isOwner && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-[#fbbf24] rounded-md shadow-lg z-10">
                          <span className="text-[10px] font-extrabold text-black uppercase tracking-wider block leading-none">
                            YOUR VIDEO
                          </span>
                        </div>
                      )}

                      {/* Duration Badge - Bottom Right */}
                      {item?.duration && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-xs font-medium text-white">
                          {formatVideoDuration(item.duration)}
                        </div>
                      )}
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: '#262626' }} />
                  )}
                </div>

                {/* --- Info Section --- */}
                <div className="flex gap-3 px-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0 pt-0.5">
                    {item ? (
                      <img
                        src={owner?.avatar || defaultAvatar}
                        alt="avatar"
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/channel/${owner?.username}`);
                        }}
                      />
                    ) : (
                      <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: '#262626' }} />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    {item ? (
                      <>
                        {/* Title */}
                        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-[#fbbf24] transition-colors">
                          {item.title || 'Untitled Video'}
                        </h3>

                        {/* Channel Name & Verified Tick */}
                        <div 
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors w-fit"
                          onClick={(e) => {
                             e.stopPropagation();
                             navigate(`/channel/${owner?.username}`);
                          }}
                        >
                          <span>{owner?.fullname || owner?.username || 'Unknown'}</span>
                          {/* Verified Tick Icon */}
                          <CheckCircle2 size={14} className="text-blue-500 fill-blue-500/10" />
                        </div>

                        {/* Views & Date */}
                        <div className="text-xs text-gray-500 font-medium">
                          {item.views ? `${item.views.toLocaleString()} views` : '0 views'}
                          <span className="mx-1">•</span>
                          {item.createdAt && timeAgo(item.createdAt)}
                        </div>
                      </>
                    ) : (
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width="90%" height={20} sx={{ mb: 1, bgcolor: '#262626' }} />
                        <Skeleton width="60%" height={16} sx={{ bgcolor: '#262626' }} />
                      </Box>
                    )}
                  </div>

                  {/* Menu Button (Three Dots) */}
                  {item && (
                    <div className="relative">
                      <button
                        onClick={(e) => handleMenuToggle(e, item._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/10 transition-all"
                      >
                        <MoreVertical size={18} className="text-white" />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpen === item._id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(null); }} />
                          <div className="absolute right-0 top-8 w-48 bg-[#1f1f1f] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                            {isOwner && (
                              <>
                                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                  <DeleteBtn videoId={item._id} />
                                  <span>Delete</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleMenuClick('Update', item._id); }}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                  <Pencil size={16} />
                                  <span>Edit</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMenuClick('Add to Playlist', item._id); }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <ListPlus size={16} />
                              <span>Save to Playlist</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Loading Skeletons */
          <div className="col-span-full py-12">
             <VideoSkeleton count={8} />
          </div>
        )}
      </div>
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