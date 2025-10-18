import React, { useContext, useEffect, useState } from 'react';
import { NavLink,  } from 'react-dom'; // note: react-router-dom, not 'react-dom'
import {
  Home,
  Play,
  Users,
  Video,
  Clock,
  ThumbsUp,
  ChevronRight,
  LogOut,
  Menu,
} from 'lucide-react';
import HeaderContext from '../context/HeaderContext';
import axios from 'axios';
import chalchitramText from  '../../assets/chalchitramText.png'
import chalchitram from  '../../assets/chalchitram.png'
import { useLocation, useNavigate } from 'react-router';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useContext(HeaderContext);

  const [active, setActive] = useState('');

  const deriveActiveFromPath = (pathname) => {
    if (pathname.startsWith('/Home')) return 'Home';
    if (pathname.startsWith('/Subscriptions')) return 'Subscriptions';
    if (pathname.startsWith('/CreatePost')) return 'Create +';
    if (pathname.startsWith('/History')) return 'History';
    if (pathname.startsWith('/Playlists')) return 'Playlists';
    if (pathname.startsWith('/userVideos')) return 'Your videos';
    if (pathname.startsWith('/liked-videos')) return 'Liked videos';
    if (pathname.startsWith('/channel/news')) return 'News';
    if (pathname.startsWith('/channel/amit')) return 'Amit';
    if (pathname.startsWith('/channel/hot')) return 'HotDays';
    // fallback
    return '';
  };

  useEffect(() => {
    const current = deriveActiveFromPath(location.pathname);
    setActive(current);
  }, [location.pathname]);

  const logOutHandler = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClick = (name, path) => {
    if (path) {
      navigate(path);
      setSidebarOpen(false);  
    }
  };

  const getHeaderBgColor = () => {
    switch (active) {
      case 'Home':
        return 'bg-blue-600';
      case 'Subscriptions':
        return 'bg-green-600';
      case 'Create +':
        return 'bg-purple-600';
      case 'History':
      case 'Playlists':
      case 'Your videos':
      case 'Liked videos':
        return 'bg-indigo-600';
      case 'News':
        return 'bg-red-600';
      case 'Amit':
        return 'bg-yellow-600';
      case 'HotDays':
        return 'bg-pink-600';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full text-white z-50 transition-all duration-500 ease-in-out transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          bg-black/40 backdrop-blur-md border-r border-gray-800
          w-[70%] sm:w-[80%] md:w-[18%]`}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-800 ${getHeaderBgColor()}`}>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {sidebarOpen && (
              <div className="flex items-center gap-1">
                <img className='w-[30%]' src={chalchitram}></img>
                <img className='w-[70%]' src={chalchitramText}></img>
              </div>
            )}
          </div>
        </div>

        <div className="py-4 overflow-y-auto scrollbar-hide">
          <div className="px-3 mb-3">
            {[
              ['Home', '/Home', <Home />],
              ['Subscriptions', '/Subscriptions', <Users />],
              ['Create +', '/CreatePost', <Video />],
            ].map(([name, path, icon]) => (
              <div
                key={name}
                onClick={() => handleClick(name, path)}
                className={`flex items-center gap-6 px-3 py-2 rounded-lg cursor-pointer ${
                  active === name ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
                <span className="text-sm">{name}</span>
                {name === 'Subscriptions' && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 my-3" />

          <div className="px-3 mb-3">
            <div className="flex items-center gap-3 px-3 py-1 mb-2">
              <span className="text-base font-medium">You</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {[
              ['History', '/History', <Clock />],
              ['Playlists', '/Playlists', <Play />],
              ['Your videos', '/userVideos', <Video />],
              ['Liked videos', '/liked-videos', <ThumbsUp />],
            ].map(([name, path, icon]) => (
              <div
                key={name}
                onClick={() => handleClick(name, path)}
                className={`flex items-center gap-6 px-3 py-2 rounded-lg cursor-pointer ${
                  active === name ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
                <span className="text-sm">{name}</span>
              </div>
            ))}

            <div
              onClick={logOutHandler}
              className="flex items-center gap-6 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-800"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-sm">Logout</span>
            </div>
          </div>

          <div className="border-t border-gray-700 my-3" />

          <div className="px-3 mb-3">
            <div className="flex items-center gap-3 px-3 py-1 mb-2">
              <span className="text-base font-medium">Subscriptions</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            <div
              onClick={() => handleClick('News', '/channel/news')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                active === 'News' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                N
              </div>
              <span className="text-sm">News18 India</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span className="text-xs text-gray-400">6</span>
              </div>
            </div>

            <div
              onClick={() => handleClick('Amit', '/channel/amit')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                active === 'Amit' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <span className="text-sm">Amit Bhadana</span>
            </div>

            <div
              onClick={() => handleClick('HotDays', '/channel/hot')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                active === 'HotDays' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                H
              </div>
              <span className="text-sm">Hot days ahead</span>
              <span className="ml-auto text-xs text-gray-400">30°C</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
