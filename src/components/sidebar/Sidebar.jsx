import React, { useContext, useState } from 'react';
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
import { useNavigate } from 'react-router';
import HeaderContext from '../context/HeaderContext';
import axios from 'axios';

export default function Sidebar() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useContext(HeaderContext);
  const [active, setActive] = useState('Home');

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
    setActive(name);
    if (path) navigate(path);
  };

  return (
    <>
      {/* Glass blur backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full text-white z-50 transition-all duration-500 ease-in-out transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        bg-black/40 backdrop-blur-md border-r border-gray-800
        w-[70%] sm:w-[80%] md:w-[18%]`}
      >
        {/* Header section with menu + logo */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {sidebarOpen && <div className="flex items-center gap-1">
              <svg width="70" height="20" viewBox="0 0 90 20" className="block">
                <g>
                  <path
                    d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35042 27.9727 3.12324Z"
                    fill="#FF0000"
                  />
                  <path
                    d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
                    fill="white"
                  />
                </g>
              </svg>
              <span className="text-l font-medium ml-2 hidden sm:inline">YouTube</span>
              <span className="text-xs text-gray-300 ml-1 hidden sm:inline">IN</span>
            </div>}
          </div>
        </div>

        {/* Sidebar content scroll area */}
        <div className="py-4 overflow-y-auto scrollbar-hide">
          {/* Main Navigation */}
          <div className="px-3 mb-3">
            {[
              ['Home', '/Home', <Home />],
              ['Shorts', '/Shorts', <Play />],
              ['Subscriptions', '/Subscriptions', <Users />],
              ['You', '/You', <Video />],
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

          {/* You Section */}
          <div className="px-3 mb-3">
            <div className="flex items-center gap-3 px-3 py-1 mb-2">
              <span className="text-base font-medium">You</span>
              <ChevronRight className="w-4 h-4" />
            </div>

            {[
              ['History', '/History', <Clock />],
              ['Playlists', '/Playlists', <Play />],
              ['Your videos', '/userVideos', <Video />],
              ['Your movies', '/Movies', <Play />],
              ['Your courses', '/Courses', <Play />],
              ['Watch later', '/WatchLater', <Clock />],
              ['Liked videos', '/Liked', <ThumbsUp />],
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

          {/* Subscriptions Section */}
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
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
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
