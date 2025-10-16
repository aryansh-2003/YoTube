import { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import { MoreVertical, Trash, Pencil, ListPlus } from 'lucide-react';
import CapybaraLoader from '../loader/Capybara';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../assets/download.jpeg';
import {timeAgo,formatVideoDuration} from '../TimeResolver.js';  
import VideoSkeleton from '../VideoSkeleton.jsx'
import DeleteBtn from '../DeleteBtn.jsx';
import PlaylistOverlay from '../PlaylistOverlay.jsx';


function Media({ loading = false, data = [] }) {
  const content = loading ? Array.from(new Array(4)) : data;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);
  const [overlayopen, setoverlayopen] = useState(null);
  const [videoid, setvideoid] = useState(null);
  const userData = useSelector((state) => state?.auth?.userData);

  const handleMenuToggle = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(menuOpen === id ? null : id);
  };

  

  const handleMenuClick = (action, id) => {
    if(action == "Update"){
        navigate(`/editvideo/${id}`)
    }else{
        setvideoid(id)
        setoverlayopen(true)

    }
    setMenuOpen(null);
  };

     const playlists = [
    { id: 1, name: "My Favourites", videosCount: 12 },
    { id: 2, name: "Watch Later", videosCount: 5 },
    { id: 3, name: "Music Mix", videosCount: 20 },
  ];

  return (
    <Grid container wrap="wrap" spacing={2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        
      
        {content && content.length > 0 ? (
          content.map((item, index) => (
            <div key={item?._id || index} className="relative text-left">
                    {overlayopen ? <>
                <PlaylistOverlay
                        playlists={playlists}
                        videoId={videoid}
                        onClose={() => setoverlayopen(false)}
                      />
              </> : ""}
              <Box
                sx={{
                  width: '100%',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => item?._id && navigate(`/video/${item._id}`)}
              >
                {/* Thumbnail */}
                {item ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16/9',
                      overflow: 'hidden',
                      borderRadius: '8px'
                    }}
                  >
                    <img
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '8px'
                      }}
                      alt={item.title}
                      src={item.thumbnail || item.src}
                    />
                    {/* Video duration badge */}
                    {item.duration && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 6,
                          right: 6,
                          bgcolor: 'rgba(0,0,0,0.85)',
                          color: 'white',
                          fontSize: '0.75rem',
                          px: 0.7,
                          py: 0.2,
                          borderRadius: '4px',
                          fontWeight: 500
                        }}
                      >
                        {item ? `${formatVideoDuration(item.duration)}` : ""}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px' }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', mt: 1.2, gap: 1.5, alignItems: 'flex-start' }}>
                {item ? (
                  <button
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/channel/${item?.ownerInfo?.[0]?.username}`);
                    }}
                  >
                    <img
                      src={item?.ownerInfo?.[0]?.avatar || defaultAvatar}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        flexShrink: 0
                      }}
                    />
                  </button>
                ) : (
                  <Skeleton variant="circular" width={36} height={36} />
                )}

                {/* Text info */}
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  {item ? (
                    <>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/video/${item._id}`);
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: 'gray', display: 'block', mt: 0.5 }}
                        className="cursor-pointer hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/channel/${item?.ownerInfo?.[0]?.username}`);
                        }}
                      >
                        {item?.ownerInfo?.[0]?.fullname}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'gray', display: 'block' }}
                      >
                        {item.views ? `${item.views} views` : ''}
                        {item.createdAt ? ` •  ${timeAgo(item.createdAt)} ago` : ''}
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <Skeleton width="90%" />
                      <Skeleton width="60%" />
                    </Box>
                  )}
                </Box>

                {item && (
                  <div className="relative">
                    <MoreVertical
                      size={18}
                      className="cursor-pointer text-gray-500 hover:text-black"
                      onClick={(e) => handleMenuToggle(e, item._id)}
                    />

                    {menuOpen === item._id && (
                      <div
                        className="absolute right-0 mt-1 bg-black shadow-lg rounded-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {content?.[index]?.owner === userData._id && (
                          <>
                            <div
                              className="flex items-center gap-2  text-sm hover:bg-orange-500 w-full text-left"
                            >
                        
                              <DeleteBtn videoId={content?.[index]?._id}/>
                              <h1 className="text-[12px]">Delete</h1>
                            </div>
                            <button
                              onClick={() => handleMenuClick('Update', item._id)}
                              className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-orange-500 w-full text-left"
                            >
                              <Pencil size={16} />
                              <h1 className="text-[12px]">Update</h1>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleMenuClick('Add to Playlist', item._id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-500 w-full text-left"
                        >
                          <ListPlus size={25} />
                          <h1 className="text-[12px]">Add to Playlist</h1>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Box>
            </div>
          ))
        ) : (
          <div className="w-full fixed h-screen">
            <VideoSkeleton/>
          </div>
        )}
      </div>
    </Grid>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array
};

export default function VideoCard({ data, loading = false }) {
  return (
    <Box sx={{ overflow: 'hidden', p: 2 }}>
      <Media loading={loading} data={data} />
    </Box>
  );
}

VideoCard.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array
};
