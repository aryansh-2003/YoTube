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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 w-full">
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
                <div className="relative w-full aspect-video md:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm transition-shadow group-hover:shadow-md">
                  {item ? (
                    <>
                      <img
                        src={item.thumbnail || defaultAvatar}
                        alt={item.title || 'video thumbnail'}
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* --- YouTube Style Overlay --- */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-between p-2">
                         {/* Top Right: Quick Actions */}
                         <div className="self-end transform translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleMenuClick('Add to Playlist', item._id);
                             }}
                             className="p-1.5 bg-white/90 hover:bg-[#ff0000] hover:text-white text-slate-800 rounded md:rounded-lg shadow-sm transition-colors"
                             title="Save to Playlist"
                           >
                             <ListPlus size={20} strokeWidth={2} />
                           </button>
                         </div>

                         {/* Center: Play Button (Visual only) */}
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Play className="w-12 h-12 text-[#ff0000] fill-[#ff0000] drop-shadow-md" />
                         </div>
                      </div>

                      {/* "YOUR VIDEO" Badge */}
                      {isOwner && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-[#ff0000] rounded-md shadow-md z-20">
                          <span className="text-[10px] font-extrabold text-white uppercase tracking-wider block leading-none">
                            YOUR VIDEO
                          </span>
                        </div>
                      )}

                      {/* Duration Badge - Bottom Right */}
                      {item?.duration && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-xs font-semibold text-white z-20 shadow-sm">
                          {formatVideoDuration(item.duration)}
                        </div>
                      )}
                    </>
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: '#e2e8f0' }} />
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
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/channel/${owner?.username}`);
                        }}
                      />
                    ) : (
                      <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: '#e2e8f0' }} />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5 mt-0.5">
                    {item ? (
                      <>
                        {/* Title */}
                        <h3 className="text-[15px] font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-[#ff0000] transition-colors">
                          {item.title || 'Untitled Video'}
                        </h3>

                        {/* Channel Name & Verified Tick */}
                        <div 
                          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit mt-1"
                          onClick={(e) => {
                             e.stopPropagation();
                             navigate(`/channel/${owner?.username}`);
                          }}
                        >
                          <span className="font-medium">{owner?.fullname || owner?.username || 'Unknown'}</span>
                          {/* Verified Tick Icon */}
                          <CheckCircle2 size={13} className="text-[#0f172a] fill-slate-200" />
                        </div>

                        {/* Views & Date */}
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          {item.views ? `${item.views.toLocaleString()} views` : '0 views'}
                          <span className="mx-1.5">•</span>
                          {item.createdAt && timeAgo(item.createdAt)}
                        </div>
                      </>
                    ) : (
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width="90%" height={20} sx={{ mb: 1, bgcolor: '#e2e8f0' }} />
                        <Skeleton width="60%" height={16} sx={{ bgcolor: '#e2e8f0' }} />
                      </Box>
                    )}
                  </div>

                  {/* Menu Button (Three Dots) */}
                  {item && (
                    <div className="relative">
                      <button
                        onClick={(e) => handleMenuToggle(e, item._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpen === item._id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(null); }} />
                          <div className="absolute right-0 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1.5">
                            {isOwner && (
                              <>
                                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#ff0000] transition-colors">
                                  <DeleteBtn videoId={item._id} />
                                  {/* Ensure DeleteBtn doesn't double text, assuming it might render its own text, otherwise we might need to adjust. */}
                                  <span className="ml-2">Delete</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleMenuClick('Update', item._id); }}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                  <Pencil size={16} />
                                  <span>Edit</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMenuClick('Add to Playlist', item._id); }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
             {/* If you have a custom skeleton component, ensure it's also adapted to light theme */}
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