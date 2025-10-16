import React, { useContext, useState } from 'react';
import { Search, Mic, Plus, Bell, Menu, ArrowLeft, Cross, Camera } from 'lucide-react';
import { useSelector } from 'react-redux';
import DisplayPic from '../DisplayPic';
import HeaderContext from '../context/HeaderContext';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import chalchitram from '../../assets/chalchitram.png'

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
      {!mobileSearchOpen && (
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-white/6 rounded-full transition"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center ml-2">
            <img src={chalchitram} className='w-20'></img>
          </div>
        </div>
      )}

      <div className="flex items-center flex-1 max-w-5xl mx-2 sm:mx-8 justify-center">
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

      </div>

      {/* RIGHT SIDE ICONS (Hidden on mobile when search open) */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-2">
          <button
            className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-white/6 rounded-full transition"
            onClick={() => navigate('/createpost')}
          >
            <Plus className="w- h- rounded-2xl overflow-hidden" />
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
