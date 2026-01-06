import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// --- ICONS ---

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#ff2d46]">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const AtSymbolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function SignUpComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const bgImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuADVNLKTIZjyJYZ8m5S9FT1MOirlDhyPdXaDlMRnslPkH3mI0qCAkHrR4iBHkfjjeU5N9MTmzpLKUHaXz6Po31tmY4Qu6nYLnL6k65H86qzYTH6aU73CIUkIrdxsF-JsVuk35w2F5ibY1bOp9njqAJqZzACZJ_MgOpGYiEjT77KjOF3hYnQX-vev8m-LwnypzHcPSNbzq1ogmcz9-9PU2wmg-zPk5hTzXGb3nAwAJDOye4w8nVtgI6EnHNrhz4a-TmoISIoCm5w_lk";

  const submitHandler = async (data) => {
    const formData = new FormData();
    formData.append("fullname", data.FullName);
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    formData.append("coverImage", data.coverImage[0]);

    authService.registerUser(formData).then((res) => {
      if (res.status === 200 || res.status === 201) {
        navigate("/"); // Navigate to login
      }
    }).catch((err) => {
      console.error(err.status);
      if (err.status === 409) {
        setError("User already exists with email or username");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-x-hidden overflow-y-auto font-sans py-16">
      
      {/* --- BACKGROUND IMAGE --- */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          filter: "brightness(0.9)" 
        }}
      />
      
      {/* --- GRADIENT OVERLAY --- */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#0c0505] z-0 pointer-events-none via-50% to-90%" />

      {/* --- TOP LEFT ICON --- */}
      <div className="absolute top-6 left-6 z-20">
        <div className="w-12 h-12 rounded-2xl bg-[#140505]/60 border border-[#ff2d46]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,45,70,0.15)] backdrop-blur-sm">
          <SparkleIcon />
        </div>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-[420px] px-6 flex flex-col items-center mt-10">
        
        {/* HEADINGS */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase mb-1 drop-shadow-lg">
            JOIN THE
          </h1>
          <h1 className="text-5xl font-black text-[#ff2d46] tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,45,70,0.6)]">
            NEXUS
          </h1>
          <p className="text-gray-300 text-sm mt-3 font-medium tracking-wide drop-shadow-md">
            Begin your journey, Shinobi.
          </p>
        </motion.div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="w-full mb-4 overflow-hidden"
            >
              <div className="bg-red-900/40 border border-red-500/50 rounded-lg px-4 py-2 text-center backdrop-blur-md">
                <p className="text-red-200 text-sm font-semibold">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form onSubmit={handleSubmit(submitHandler)} className="w-full space-y-4">
          
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white">
              <UserIcon />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full bg-[#1e0e0e] border ${errors.FullName ? 'border-red-500' : 'border-[#4a1d1d]/30 group-hover:border-[#ff2d46]/40'} 
              rounded-xl py-3.5 pl-12 pr-4 text-gray-200 placeholder-gray-500/70 focus:outline-none focus:ring-1 focus:ring-[#ff2d46] focus:border-[#ff2d46] transition-all duration-300`}
              {...register("FullName", { required: "Full Name is required" })}
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white">
              <AtSymbolIcon />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full bg-[#1e0e0e] border ${errors.email ? 'border-red-500' : 'border-[#4a1d1d]/30 group-hover:border-[#ff2d46]/40'} 
              rounded-xl py-3.5 pl-12 pr-4 text-gray-200 placeholder-gray-500/70 focus:outline-none focus:ring-1 focus:ring-[#ff2d46] focus:border-[#ff2d46] transition-all duration-300`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Invalid email",
                },
              })}
            />
          </div>

          {/* Username */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white">
              <TagIcon />
            </div>
            <input
              type="text"
              placeholder="Username"
              className={`w-full bg-[#1e0e0e] border ${errors.username ? 'border-red-500' : 'border-[#4a1d1d]/30 group-hover:border-[#ff2d46]/40'} 
              rounded-xl py-3.5 pl-12 pr-4 text-gray-200 placeholder-gray-500/70 focus:outline-none focus:ring-1 focus:ring-[#ff2d46] focus:border-[#ff2d46] transition-all duration-300`}
              {...register("username", { required: "Username is required" })}
            />
          </div>

          {/* Avatar (File Input) */}
          <div className="relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white">
              <PhotoIcon />
            </div>
            <input
              type="file"
              className={`w-full bg-[#1e0e0e] border ${errors.avatar ? 'border-red-500' : 'border-[#4a1d1d]/30 group-hover:border-[#ff2d46]/40'} 
              rounded-xl py-2.5 pl-12 pr-4 text-gray-400 text-sm
              file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold 
              file:bg-[#2a1012] file:text-[#ff2d46] hover:file:bg-[#3d1518]
              focus:outline-none focus:ring-1 focus:ring-[#ff2d46] focus:border-[#ff2d46] transition-all duration-300 cursor-pointer`}
              {...register("avatar", { required: "Avatar is required" })}
            />
             {/* Label overlay for cleaner look if file input styling fails in some browsers, but Tailwind file: modifiers usually work well */}
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-bold uppercase pointer-events-none">Avatar</span>
          </div>

          {/* Cover Image (File Input) */}
          <div className="relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white">
              <PhotoIcon />
            </div>
            <input
              type="file"
              className="w-full bg-[#1e0e0e] border border-[#4a1d1d]/30 group-hover:border-[#ff2d46]/40
              rounded-xl py-2.5 pl-12 pr-4 text-gray-400 text-sm
              file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold 
              file:bg-[#2a1012] file:text-gray-400 hover:file:bg-[#3d1518] hover:file:text-[#ff2d46]
              focus:outline-none focus:ring-1 focus:ring-[#ff2d46] focus:border-[#ff2d46] transition-all duration-300 cursor-pointer"
              {...register("coverImage")}
            />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-bold uppercase pointer-events-none">Cover (Optional)</span>
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white">
              <LockIcon />
            </div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full bg-[#1e0e0e] border ${errors.password ? 'border-red-500' : 'border-[#4a1d1d]/30 group-hover:border-[#ff2d46]/40'} 
              rounded-xl py-3.5 pl-12 pr-4 text-gray-200 placeholder-gray-500/70 focus:outline-none focus:ring-1 focus:ring-[#ff2d46] focus:border-[#ff2d46] transition-all duration-300 tracking-widest`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Min 6 characters",
                },
              })}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#ff2d46] hover:bg-[#eb263d] text-white font-bold text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(255,45,70,0.3)] hover:shadow-[0_0_30px_rgba(255,45,70,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center uppercase tracking-wider"
          >
            {isSubmitting ? "INITIATING..." : "CREATE ACCOUNT"} 
            {!isSubmitting && <ArrowIcon />}
          </motion.button>
        </form>

        {/* --- FOOTER --- */}
        <div className="mt-8 text-center pb-8">
          <p className="text-gray-500 text-sm font-medium">
            Already a Shinobi?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-[#ff2d46] font-bold hover:text-white transition-colors ml-1"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}