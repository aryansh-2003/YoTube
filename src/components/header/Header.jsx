import React, { useContext, useState } from 'react';
import { Search, Mic, Plus, Bell, Menu, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import DisplayPic from '../DisplayPic';
import HeaderContext from '../context/HeaderContext';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

export default function Header() {
  const userData = useSelector((state) => state.auth.userData);
  const { setSidebarOpen, setinputvalue } = useContext(HeaderContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const onsubmit = (data) => {
    console.log(data);
    setinputvalue(data.Text);
    navigate('/SearchPage');
    setMobileSearchOpen(false);
  };

  return (
    <header
      className="
        flex items-center justify-between w-full px-4 py-2
        h-14 fixed top-0 left-0 right-0 z-50 border-b
        backdrop-blur-lg bg-white/6 border-white/8
        shadow-sm
      "
      style={{ willChange: 'backdrop-filter' }}
    >
      {/* LEFT SIDE: MENU + LOGO */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-white/6 rounded-full transition"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-1">
            <svg width="90" height="20" viewBox="0 0 90 20" className="block">
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
            <span className="text-xl font-medium ml-2 hidden sm:inline">YouTube</span>
            <span className="text-xs text-gray-300 ml-1 hidden sm:inline">IN</span>
          </div>
        </div>
      )}

      {/* CENTER: SEARCH BAR (desktop) or MOBILE SEARCH INPUT */}
      <div className="flex items-center flex-1 max-w-2xl mx-2 sm:mx-8 justify-center">
        {/* Desktop Search (glass style) */}
        <form
          className={`hidden sm:flex flex-1 max-w-xl transition-all duration-200 ${mobileSearchOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
          onSubmit={handleSubmit(onsubmit)}
        >
          <div className="flex items-center w-full bg-white/6 backdrop-blur-md border border-white/8 rounded-full h-10 px-1">
            <input
              {...register('Text', { required: 'Please enter a search term' })}
              type="text"
              placeholder="Search"
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-white placeholder-gray-300"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full hover:bg-white/8 transition"
              aria-label="search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Mobile Search Icon or Input (glass overlay effect) */}
        <div className="sm:hidden flex items-center w-full justify-end">
          {!mobileSearchOpen ? (
            <button
              className="p-2 hover:bg-white/6 rounded-full transition"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="open search"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          ) : (
            // mobile search area expands to fill available center/right area
            <form
              className="flex items-center w-full transition-all duration-200"
              onSubmit={handleSubmit(onsubmit)}
            >
              <button
                type="button"
                className="p-2 mr-2 hover:bg-white/6 rounded-full transition"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="close search"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>

              <div className="flex items-center w-full bg-white/6 backdrop-blur-md border border-white/8 rounded-full h-10 px-2">
                <input
                  {...register('Text', { required: 'Please enter a search term' })}
                  type="text"
                  placeholder="Search"
                  className="flex-1 px-2 py-2 bg-transparent focus:outline-none text-white placeholder-gray-300"
                  autoFocus
                />
                <button type="submit" className="ml-2 p-2 rounded-full hover:bg-white/8 transition" aria-label="search-submit">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Microphone (hidden while mobile search is open) */}
        {!mobileSearchOpen && (
          <button className="p-2 ml-2 sm:ml-4 hover:bg-white/6 rounded-full transition bg-transparent">
            <Mic className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* RIGHT SIDE ICONS (Hidden on mobile when search open) */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-2">
          <button
            className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-white/6 rounded-full transition"
            onClick={() => navigate('/createpost')}
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Create</span>
          </button>
          <button className="p-2 hover:bg-white/6 rounded-full transition relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              9+
            </span>
          </button>
          <button className="rounded-full flex flex-col items-center ml-2">
            <DisplayPic children={userData} />
          </button>
        </div>
      )}
    </header>
  );
}
