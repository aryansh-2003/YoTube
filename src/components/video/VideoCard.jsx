import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import { MoreVertical, Pencil, ListPlus } from 'lucide-react';
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
    <Grid container spacing={3} className="w-full">  {/* ensure full width */}
      {overlayOpen && (
        <PlaylistOverlay
          playlists={playlists}
          videoId={videoId}
          onClose={() => setOverlayOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full mb-12">
        {content && content.length > 0 ? (
          content.map((item, index) => {
            const owner = item?.ownerInfo?.[0] || {};
            const isOwner = item?.owner === userData?._id;

            return (
              <div
                key={item?._id || index}
                className="relative group flex p-1 flex-col transition-transform duration-300 hover:scale-[1.04]"
              >
                {/* Colorful animated glow */}
                <div className="absolute inset-0  opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-orange-400 to-purple-500 blur-3xl animate-gradientBackground"></div>
                </div>

                {/* Card container */}
                <div className="relative backdrop-blur-3xl bg-black  shadow-lg z-10 overflow-hidden">
                  {/* Thumbnail */}
                  <div
                    className="relative w-full aspect-video overflow-hidden cursor-pointer"
                    onClick={() => item?._id && navigate(`/video/${item._id}`)}
                  >
                    {item ? (
                      <img
                        src={item.thumbnail || defaultAvatar}
                        alt={item.title || 'video thumbnail'}
                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px' }}
                      />
                    )}

                    {item?.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm font-medium">
                        {formatVideoDuration(item.duration)}
                      </span>
                    )}
                  </div>

                  {/* Info section */}
                  <div className="flex mt-3 gap-3 items-start p-3">
                    {/* Avatar */}
                    {item ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/channel/${owner?.username}`);
                        }}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={owner?.avatar || defaultAvatar}
                          onError={(e) => (e.currentTarget.src = defaultAvatar)}
                          alt="channel avatar"
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                      </button>
                    ) : (
                      <Skeleton variant="circular" width={36} height={36} />
                    )}

                    {/* Texts */}
                    <div className="flex-1 overflow-hidden">
                      {item ? (
                        <>
                          <Typography
                            variant="body1"
                            className="text-gray-100 font-semibold leading-snug line-clamp-2 hover:text-orange-400 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/video/${item._id}`);
                            }}
                          >
                            {item.title || 'Untitled'}
                          </Typography>

                          <Typography
                            variant="caption"
                            className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors mt-0.5 block"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/channel/${owner?.username}`);
                            }}
                          >
                            {owner?.fullname || owner?.username || 'Unknown Channel'}
                          </Typography>

                          <Typography variant="caption" className="text-gray-500 block">
                            {item.views ? `${item.views} views` : 'No views yet'}
                            {item.createdAt ? ` • ${timeAgo(item.createdAt)} ago` : ''}
                          </Typography>
                        </>
                      ) : (
                        <Box sx={{ width: '100%' }}>
                          <Skeleton width="90%" />
                          <Skeleton width="60%" />
                        </Box>
                      )}
                    </div>

                    {/* Menu */}
                    {item && (
                      <div className="relative">
                        <MoreVertical
                          size={18}
                          className="cursor-pointer text-gray-400 hover:text-orange-400 transition-colors"
                          onClick={(e) => handleMenuToggle(e, item._id)}
                        />

                        {menuOpen === item._id && (
                          <div
                            className="absolute right-0 mt-2 bg-[#1f1f1f]/90 backdrop-blur-md border border-white/10 shadow-lg rounded-xl z-50 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isOwner && (
                              <>
                                <div className="flex items-center gap-2 text-sm hover:bg-orange-600/40 px-3 py-2 text-gray-200 cursor-pointer transition-all">
                                  <DeleteBtn videoId={item._id} />
                                  <span className="text-xs">Delete</span>
                                </div>
                                <button
                                  onClick={() => handleMenuClick('Update', item.__id)}
                                  className="flex items-center gap-2 text-sm hover:bg-orange-600/40 px-3 py-2 text-gray-200 w-full text-left transition-all"
                                >
                                  <Pencil size={16} />
                                  <span className="text-xs">Update</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleMenuClick('Add to Playlist', item._id)}
                              className="flex items-center gap-2 text-sm hover:bg-orange-600/40 px-3 py-2 text-gray-200 w-full text-left transition-all"
                            >
                              <ListPlus size={18} />
                              <span className="text-xs">Add to Playlist</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex items-center justify-center">
            <VideoSkeleton count={8} />
          </div>
        )}
      </div>
    </Grid>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
};

export default function VideoCard({ data, loading = false }) {
  return (
    <Box sx={{ p: 0, width: '100%' }}>  {/* removed padding and ensure full width */}
      <Media loading={loading} data={data} />
    </Box>
  );
}

VideoCard.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
};
