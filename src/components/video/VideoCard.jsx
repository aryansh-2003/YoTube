import {useState} from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import { MoreVertical, Trash, Pencil, ListPlus, RefreshCcw } from 'lucide-react';
import CapybaraLoader from '../loader/Capybara';
import { useSelector } from 'react-redux';

function Media({ loading = false, data = [] }) {
  const content = loading ? Array.from(new Array(4)) : data;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);
  const userData = useSelector(state => state?.auth?.userData)


  
  const handleMenuToggle = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleMenuClick = (action, id) => {
    console.log(`${action} clicked for video ${id}`);
    setMenuOpen(null);
  };

  return (
    <Grid container wrap="wrap" spacing={2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {content && content.length > 0 ? (
          content.map((item, index) => (
            <button
              key={item?._id || index}
              onClick={() => navigate(`/video/${item._id}`)}
              className="relative text-left"
            >
              <Box sx={{ width: '100%', cursor: 'pointer', position: 'relative' }}>
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
                        {item.duration}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px' }}
                  />
                )}

                {/* Video info row */}
                <Box sx={{ display: 'flex', mt: 1.2, gap: 1.5, alignItems: 'flex-start' }}>
                  {/* Channel avatar */}
                  {item ? (
                    <img
                      src={item?.ownerInfo?.[0]?.avatar || '/default-avatar.png'}
                      alt={item.channel || 'channel'}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        flexShrink: 0
                      }}
                    />
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
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'gray', display: 'block', mt: 0.5 }}
                        >
                          {item?.ownerInfo?.[0]?.fullname}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'gray', display: 'block' }}
                        >
                          {item.views ? `${item.views} views` : ''}
                          {item.createdAt ? ` • ${item.createdAt} ago` : ''}
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width="90%" />
                        <Skeleton width="60%" />
                      </Box>
                    )}
                  </Box>

                  {/* Three-dot menu */}
                  {item && (
                    <div className="relative">
                      <MoreVertical
                        size={18}
                        className="cursor-pointer text-gray-500 hover:text-black"
                        onClick={(e) => handleMenuToggle(e, item._id)}
                      />

                      {menuOpen === item._id && (
                        <div
                          className="absolute right-0 mt-1 bg-black shadow-lg rounded-lg   z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {content?.[index]?.owner === userData._id &&
                          <>
                          <button
                            onClick={() => handleMenuClick('Delete', item._id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-500 w-full text-left"
                          >
                            <Trash size={16} />
                            <h1 className='text-[12px]'>Delete</h1>
                          </button>
                          <button
                            onClick={() => handleMenuClick('Update', item._id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-500 w-full text-left"
                          >
                            <Pencil size={16} />
                              <h1 className='text-[12px]'>Update</h1>
                          </button>
                          </>
                          }
                          <button
                            onClick={() => handleMenuClick('Add to Playlist', item._id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-500 w-full text-left"
                          >
                            <ListPlus size={25} />
                           <h1 className='text-[12px]'>Add to Playlist</h1> 
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Box>
              </Box>
            </button>
          ))
        ) : (
          <div className='absolute w-full  top-0 bottom-0 right-0 left-0 '>
          <CapybaraLoader />
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
