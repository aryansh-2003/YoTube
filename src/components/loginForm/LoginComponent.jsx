import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/authSlice";
import chalchitram from "../../assets/chalchitram.png";
import chalChitramText from "../../assets/chalchitramText.png";
import { motion } from "framer-motion";

export default function LoginComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    if (data) {
      try {
        const userData = await authService.login(data.email, data.password);
        if (userData.status === 401) {
          setError("Check your credentials 😞");
          return;
        } else if (userData.status === 404) {
          setError("User doesn't exist 😞");
          return;
        }
        dispatch(login(userData?.data?.data));
        navigate("/Home");
      } catch (err) {
        console.error("Login error:", err);
        if (err?.response?.status === 500) {
          setError("Server error. Please try again later 😞");
        } else {
          setError("Something went wrong. Try again later 😞");
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sharingan-inspired circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 border-4 border-red-500/30 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)",
          }}
        >
          <div className="absolute inset-4 border-4 border-red-400/40 rounded-full"></div>
          <div className="absolute inset-8 border-4 border-red-300/50 rounded-full"></div>
        </motion.div>

        {/* Demon Slayer pattern */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-40 h-40"
        >
          <div className="absolute inset-0 bg-gradient-conic from-green-500/20 via-black/20 to-green-500/20 rounded-full"></div>
        </motion.div>

        {/* Floating sakura petals */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 0 }}
            animate={{
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth,
              opacity: [0, 1, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
            className="absolute w-3 h-3 bg-pink-300/60 rounded-full"
            style={{
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        ))}

        {/* Kunai decoration */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-10 text-6xl opacity-20 rotate-45"
        >
          ⚔️
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-10 text-5xl opacity-20 -rotate-45"
        >
          🗡️
        </motion.div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full animate-pulse"></div>
      </div>

      {/* Floating brand logo with anime effect */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        className="absolute top-8 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={chalchitram}
            alt="chalchitram"
            className="w-16 sm:w-20 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
          />
        </motion.div>
        <img
          src={chalChitramText}
          alt="chalchitram-text"
          className="w-28 sm:w-36 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />
      </motion.div>

      {/* Error banner with anime style */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-32 z-50 text-center w-full px-4"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-red-500/30 blur-md rounded-lg"></div>
            <p className="relative text-red-300 text-sm sm:text-base font-bold bg-gradient-to-r from-red-950/90 to-pink-950/90 backdrop-blur-md px-6 py-3 rounded-lg border-2 border-red-500/50 shadow-lg">
              ⚠️ {error}
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Form with anime-style design */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="w-[90%] sm:w-[420px] relative z-10"
      >
        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-cyan-400/80"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-cyan-400/80"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-cyan-400/80"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-cyan-400/80"></div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-indigo-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 border-purple-500/30 space-y-6 relative overflow-hidden"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-[100%] bg-gradient-conic from-cyan-500/30 via-transparent via-transparent via-transparent to-cyan-500/30"
            ></motion.div>
          </div>

          {/* Title with anime font style */}
          <div className="relative text-center space-y-1">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black tracking-wider relative inline-block"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                SIGN IN
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </motion.h2>
            <p className="text-xs text-purple-300/80 font-semibold tracking-widest">
              忍者の道 • THE NINJA WAY
            </p>
          </div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-bold text-cyan-300 mb-2 tracking-wide"
            >
              📧 EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-lg bg-slate-950/60 text-white placeholder-gray-500 border-2 ${
                  errors.email
                    ? "border-red-500 focus:border-red-400"
                    : "border-purple-500/50 focus:border-cyan-400"
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all backdrop-blur-sm font-medium`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-400 font-semibold flex items-center gap-1"
                >
                  ⚠️ {errors.email.message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-bold text-cyan-300 mb-2 tracking-wide"
            >
              🔐 PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg bg-slate-950/60 text-white placeholder-gray-500 border-2 ${
                  errors.password
                    ? "border-red-500 focus:border-red-400"
                    : "border-purple-500/50 focus:border-cyan-400"
                } focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all backdrop-blur-sm font-medium`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-400 font-semibold flex items-center gap-1"
                >
                  ⚠️ {errors.password.message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34, 211, 238, 0.6)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full py-3.5 text-white font-black text-lg tracking-wider rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 border border-cyan-400/30 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  SIGNING IN...
                </>
              ) : (
                <>⚡ SIGN IN ⚡</>
              )}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.button>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center relative"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-4"></div>
            <p className="text-sm text-gray-400 font-medium">
              New to this world?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-cyan-400 hover:text-cyan-300 font-bold underline-offset-2 hover:underline transition-all ml-1"
              >
                Join the Adventure →
              </button>
            </p>
          </motion.div>

          {/* Decorative anime symbols */}
          <div className="absolute top-4 right-4 text-2xl opacity-20">✨</div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-20">🌸</div>
        </form>
      </motion.div>

      {/* Character silhouettes (decorative) */}
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 text-9xl opacity-10 pointer-events-none"
      >
        🥷
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -15, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-0 text-9xl opacity-10 pointer-events-none"
      >
        ⚔️
      </motion.div>
    </div>
  );
}