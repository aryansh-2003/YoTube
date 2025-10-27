import React, { useContext, useState } from 'react';
import { Search, Plus, Bell, Menu, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import DisplayPic from '../DisplayPic';
import HeaderContext from '../context/HeaderContext';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import chalchitram from '../../assets/chalchitram.png';

export default function Header() {
  const userData = useSelector((state) => state.auth.userData);
  const { setSidebarOpen, setinputvalue } = useContext(HeaderContext);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const onsubmit = (data) => {
    setinputvalue(data.Text);
    navigate('/SearchPage');
    setMobileSearchOpen(false);
  };

  return (
    <header className="flex items-center justify-between w-full px-4 sm:px-6 py-2 h-16 fixed top-0 left-0 right-0 z-50 border-b-2 border-amber-400/30 shadow-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
        boxShadow: '0 8px 32px 0 rgba(255, 107, 0, 0.2), inset 0 1px 0 0 rgba(255, 215, 0, 0.1)',
        willChange: 'backdrop-filter'
      }}>
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      {/* Decorative Border Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"></div>
      
      {/* LEFT: Menu & Logo */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-4 z-10 relative">
          <button
            className="p-2.5 bg-gradient-to-br from-orange-500/20 to-red-600/20 hover:from-orange-500/40 hover:to-red-600/40 rounded-lg border border-amber-400/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50 group"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="toggle menu"
          >
            <Menu className="w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors" />
          </button>
          <div className="flex items-center relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-lg opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>
            <img src={chalchitram} className="w-20 relative z-10 drop-shadow-2xl" alt="Logo" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.6))' }} />
          </div>
        </div>
      )}

      {/* CENTER: Search */}
      <div className="flex items-center flex-1 max-w-5xl mx-2 sm:mx-8 justify-center z-10">
        {/* Desktop Search */}
        <form
          className={`hidden sm:flex flex-1 max-w-xl transition-all duration-300 ${mobileSearchOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
          onSubmit={handleSubmit(onsubmit)}
        >
          <div className="flex items-center w-full bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl border-2 border-amber-400/40 rounded-full h-11 px-1 shadow-lg hover:shadow-amber-400/30 transition-all duration-300 hover:border-amber-400/60 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-amber-400/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <input
              {...register('Text', { required: 'Please enter a search term' })}
              type="text"
              placeholder="Search the shinobi world..."
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-amber-50 placeholder-amber-200/60 rounded-full relative z-10 font-medium"
              style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
            />
            <button type="submit" className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/30 to-red-500/30 hover:from-orange-500/50 hover:to-red-500/50 transition-all duration-300 mr-1 hover:scale-105 relative z-10" aria-label="search">
              <Search className="w-5 h-5 text-amber-300" />
            </button>
          </div>
        </form>

        {/* Mobile Search */}
        <div className="sm:hidden flex items-center w-full justify-end">
          {!mobileSearchOpen ? (
            <button
              className="p-2.5 bg-gradient-to-br from-orange-500/20 to-red-600/20 hover:from-orange-500/40 hover:to-red-600/40 rounded-lg border border-amber-400/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="open search"
            >
              <Search className="w-6 h-6 text-amber-300" />
            </button>
          ) : (
            <form className="flex items-center w-full transition-all duration-300" onSubmit={handleSubmit(onsubmit)}>
              <button
                type="button"
                className="p-2 mr-2 bg-gradient-to-br from-orange-500/20 to-red-600/20 hover:from-orange-500/40 hover:to-red-600/40 rounded-lg border border-amber-400/30 transition-all duration-300"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="close search"
              >
                <ArrowLeft className="w-6 h-6 text-amber-300" />
              </button>
              <div className="flex items-center w-full bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-xl border-2 border-amber-400/40 rounded-full h-11 px-2 shadow-lg">
                <input
                  {...register('Text', { required: 'Please enter a search term' })}
                  type="text"
                  placeholder="Search..."
                  className="flex-1 px-2 py-2 bg-transparent focus:outline-none text-amber-50 placeholder-amber-200/60 font-medium"
                  autoFocus
                  style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.3)' }}
                />
                <button type="submit" className="ml-2 p-2 rounded-full bg-gradient-to-r from-orange-500/30 to-red-500/30 hover:from-orange-500/50 hover:to-red-500/50 transition-all duration-300" aria-label="search-submit">
                  <Search className="w-5 h-5 text-amber-300" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* RIGHT: Icons */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-2 z-10">
          <button
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 hover:from-orange-500/50 hover:via-red-500/50 hover:to-pink-500/50 rounded-full border border-amber-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50 group relative overflow-hidden"
            onClick={() => navigate('/createpost')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-amber-300/20 to-orange-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="w-5 h-5 text-amber-200 relative z-10" />
            <span className="text-sm text-amber-100 font-semibold relative z-10" style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}>Create</span>
          </button>
          
          <button className="p-2.5 bg-gradient-to-br from-orange-500/20 to-red-600/20 hover:from-orange-500/40 hover:to-red-600/40 rounded-lg border border-amber-400/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50 relative group">
            <Bell className="w-6 h-6 text-amber-300 group-hover:text-amber-200 transition-colors" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse border border-red-300/50">
              9+
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/channeldashboard')} 
            className="rounded-full flex flex-col items-center ml-2 relative group transition-transform duration-300 hover:scale-110"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 animate-pulse"></div>
            <div className="relative ring-2 ring-amber-400/50 group-hover:ring-amber-300 rounded-full transition-all duration-300">
              <DisplayPic children={userData} />
            </div>
          </button>
        </div>
      )}
    </header>
  );
}