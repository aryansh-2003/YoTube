import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/authSlice";
import { motion, AnimatePresence } from "framer-motion";

// --- ICONS ---

// Sparkle Icon (Matches the top left of the screenshot)
const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#ff2d46]">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.813 1.053 6.427 2.56L21.3 3.48c-2.48-2.32-5.787-3.653-9.3-3.653C5.373-.173.187 5.013.187 11.827s5.187 12 12 12c3.467 0 6.373-1.147 8.507-3.307 2.187-2.187 3.253-5.333 3.253-8.667 0-.587-.053-1.12-.133-1.653H12.48z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function LoginComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const bgImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuADVNLKTIZjyJYZ8m5S9FT1MOirlDhyPdXaDlMRnslPkH3mI0qCAkHrR4iBHkfjjeU5N9MTmzpLKUHaXz6Po31tmY4Qu6nYLnL6k65H86qzYTH6aU73CIUkIrdxsF-JsVuk35w2F5ibY1bOp9njqAJqZzACZJ_MgOpGYiEjT77KjOF3hYnQX-vev8m-LwnypzHcPSNbzq1ogmcz9-9PU2wmg-zPk5hTzXGb3nAwAJDOye4w8nVtgI6EnHNrhz4a-TmoISIoCm5w_lk";

  const submitHandler = async (data) => {
    if (data) {
      try {
        const userData = await authService.login(data.email, data.password);
        if (userData.status === 401) {
          setError("Check your credentials");
          return;
        } else if (userData.status === 404) {
          setError("User doesn't exist");
          return;
        }
        dispatch(login(userData?.data?.data));
        navigate("/Home");
      } catch (err) {
        console.error("Login error:", err);
        if (err?.response?.status === 500) {
          setError("Server error. Please try again later");
        } else {
          setError("Something went wrong. Try again later");
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND IMAGE --- */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          filter: "brightness(0.9)" 
        }}
      />
      
      {/* --- GRADIENT OVERLAY (Fades bottom to black for text readability) --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#0c0505] z-0 pointer-events-none via-60% to-90%" />

      {/* --- TOP LEFT ICON --- */}
      <div className="absolute top-6 left-6 z-20">
        <div className="w-12 h-12 rounded-2xl bg-[#140505]/60 border border-[#ff2d46]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,45,70,0.15)] backdrop-blur-sm">
          <SparkleIcon />
        </div>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full max-w-[380px] px-6 flex flex-col items-center mt-32 md:mt-40">
        
        {/* HEADINGS */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase mb-1 drop-shadow-lg">
            ENTER THE
          </h1>
          <h1 className="text-5xl font-black text-[#ff2d46] tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,45,70,0.6)]">
            NEXUS
          </h1>
          <p className="text-gray-300 text-sm mt-3 font-medium tracking-wide drop-shadow-md">
            Welcome back, Shinobi.
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
          
          {/* Email Field */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white">
              <UserIcon />
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

          {/* Password Field */}
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

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-1">
            <button type="button" className="text-gray-500 hover:text-white text-xs font-medium transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#ff2d46] hover:bg-[#eb263d] text-white font-bold text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(255,45,70,0.3)] hover:shadow-[0_0_30px_rgba(255,45,70,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center uppercase tracking-wider"
          >
            {isSubmitting ? "ENTERING..." : "LOGIN"} 
            {!isSubmitting && <ArrowIcon />}
          </motion.button>
        </form>

        {/* --- SOCIAL LOGIN SECTION --- */}
        <div className="w-full mt-8">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-gray-600 text-[10px] font-bold tracking-widest uppercase">Or summon with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <motion.button 
              whileHover={{ y: -3, backgroundColor: "#2a1012" }}
              className="w-12 h-12 rounded-full bg-[#1a0a0a] border border-[#331111] flex items-center justify-center transition-all hover:border-[#ff2d46]/50"
            >
              <GoogleIcon />
            </motion.button>
            <motion.button 
              whileHover={{ y: -3, backgroundColor: "#2a1012" }}
              className="w-12 h-12 rounded-full bg-[#1a0a0a] border border-[#331111] flex items-center justify-center transition-all hover:border-[#ff2d46]/50"
            >
              <GithubIcon />
            </motion.button>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-10 text-center pb-8">
          <p className="text-gray-500 text-sm font-medium">
            New to the clan?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#ff2d46] font-bold hover:text-white transition-colors ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}