import React, { useContext, useState } from 'react';
import { Search, Plus, Bell, Menu, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import DisplayPic from '../DisplayPic';
import HeaderContext from '../context/HeaderContext';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import chalchitram from '../../assets/chalchitram.png';
import { motion, AnimatePresence } from 'framer-motion';

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
    <header className="flex items-center justify-between w-full px-4 sm:px-6 py-3 h-16 fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
      
      {/* Animated ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px]"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, -80, 0],
            opacity: [0.02, 0.06, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px]"
        ></motion.div>
      </div>

      {/* LEFT: Menu & Logo */}
      <AnimatePresence mode="wait">
        {!mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-4 z-10 relative"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg transition-all relative group"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="toggle menu"
            >
              <Menu className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors" />
              <motion.div
                className="absolute inset-0 rounded-lg bg-white/5"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
            
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.img
                src={chalchitram}
                className="w-20"
                alt="Logo"
                animate={{
                  filter: [
                    "drop-shadow(0 0 2px rgba(139, 92, 246, 0.3))",
                    "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
                    "drop-shadow(0 0 2px rgba(139, 92, 246, 0.3))",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTER: Search */}
      <div className="flex items-center flex-1 max-w-5xl mx-2 sm:mx-8 justify-center z-10">
        {/* Desktop Search */}
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: mobileSearchOpen ? 0.3 : 1, y: 0 }}
          className={`hidden sm:flex flex-1 max-w-xl ${mobileSearchOpen ? 'pointer-events-none' : ''}`}
          onSubmit={handleSubmit(onsubmit)}
        >
          <div className="flex items-center w-full bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg h-10 px-1 hover:border-white/15 group transition-all relative overflow-hidden">
            {/* Subtle shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            <input
              {...register('Text', { required: 'Please enter a search term' })}
              type="text"
              placeholder="Search..."
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-white/90 placeholder-white/40 rounded-lg relative z-10"
            />
            <motion.button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 mr-1 relative z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="search"
            >
              <Search className="w-4 h-4 text-white/70" />
            </motion.button>
          </div>
        </motion.form>

        {/* Mobile Search */}
        <div className="sm:hidden flex items-center w-full justify-end">
          <AnimatePresence mode="wait">
            {!mobileSearchOpen ? (
              <motion.button
                key="search-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="open search"
              >
                <Search className="w-5 h-5 text-white/70" />
              </motion.button>
            ) : (
              <motion.form
                key="search-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center w-full"
                onSubmit={handleSubmit(onsubmit)}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 mr-2 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg"
                  onClick={() => setMobileSearchOpen(false)}
                  aria-label="close search"
                >
                  <ArrowLeft className="w-5 h-5 text-white/70" />
                </motion.button>
                <div className="flex items-center w-full bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg h-10 px-2">
                  <input
                    {...register('Text', { required: 'Please enter a search term' })}
                    type="text"
                    placeholder="Search..."
                    className="flex-1 px-2 py-2 bg-transparent focus:outline-none text-white/90 placeholder-white/40"
                    autoFocus
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 p-2 rounded-md bg-white/5 hover:bg-white/10"
                    aria-label="search-submit"
                  >
                    <Search className="w-4 h-4 text-white/70" />
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Icons */}
      <AnimatePresence mode="wait">
        {!mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all relative group overflow-hidden"
              onClick={() => navigate('/createpost')}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <Plus className="w-4 h-4 text-white/70 group-hover:text-white/90 relative z-10 transition-colors" />
              <span className="text-sm text-white/70 group-hover:text-white/90 relative z-10 transition-colors">Create</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg relative group"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-white/5 rounded-lg"
              />
              <Bell className="w-5 h-5 text-white/70 group-hover:text-white/90 relative z-10 transition-colors" />
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1 bg-white/90 text-[#0a0a0a] text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center"
              >
                9+
              </motion.span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/channeldashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full flex items-center ml-2 relative group"
            >
              {/* Rotating ring animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0%, rgba(139, 92, 246, 0.3) 50%, transparent 100%)",
                  padding: "2px",
                }}
              />
              
              {/* Pulsing glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-violet-500/20 rounded-full blur-md"
              />
              
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
              
              <div className="ring-2 ring-white/10 group-hover:ring-violet-400/40 rounded-full transition-all relative z-10">
                <DisplayPic children={userData} />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}