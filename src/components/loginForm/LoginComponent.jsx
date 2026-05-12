import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial } from "@react-three/drei";

// --- 3D BACKGROUND COMPONENT ---
const Background3D = () => {
  return (
    <div className="absolute inset-0 z-0 bg-slate-50 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#ffcccc" />
        
        {/* Sphere */}
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={[-3.5, 1.5, -2]}>
            <sphereGeometry args={[1.2, 64, 64]} />
            <MeshDistortMaterial 
              color="#ff2a2a" 
              envMapIntensity={1} 
              clearcoat={1} 
              clearcoatRoughness={0.1} 
              metalness={0.1} 
              roughness={0.2} 
              distort={0.4} 
              speed={2} 
            />
          </mesh>
        </Float>
        
        {/* PLAY BUTTON SHAPE (Triangular prism) instead of Box */}
        <Float speed={2.5} rotationIntensity={2} floatIntensity={3}>
          <mesh position={[4, -1, -3]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[1.6, 1.6, 0.4, 3]} />
            <meshPhysicalMaterial 
              color="#ff0000" 
              roughness={0.2} 
              metalness={0.1} 
              clearcoat={0.8}
            />
          </mesh>
        </Float>
        
        {/* Torus */}
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[3, 3, -4]} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
            <torusGeometry args={[1.2, 0.4, 32, 64]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              roughness={0.1} 
              metalness={0.5} 
              clearcoat={1}
            />
          </mesh>
        </Float>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

// --- ICONS ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.813 1.053 6.427 2.56L21.3 3.48c-2.48-2.32-5.787-3.653-9.3-3.653C5.373-.173.187 5.013.187 11.827s5.187 12 12 12c3.467 0 6.373-1.147 8.507-3.307 2.187-2.187 3.253-5.333 3.253-8.667 0-.587-.053-1.12-.133-1.653H12.48z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LogoIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4L19 12L5 20V4Z" stroke="#E1AD01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="transparent"/>
    <path d="M5 4L19 12L5 20V4Z" fill="#E1AD01" fillOpacity="0.2"/>
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      
      <Background3D />
      
      {/* --- GRADIENT OVERLAY (Subtle soft gradient to blend corners) --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-red-50/70 z-0 pointer-events-none" />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] px-8 py-10 mx-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center"
      >
        
        {/* LOGO & HEADINGS */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-4"
          >
            <LogoIcon />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Sign in to continue to your streaming world
          </p>
        </div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="w-full mb-6 overflow-hidden"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
                <p className="text-red-600 text-sm font-semibold">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <form onSubmit={handleSubmit(submitHandler)} className="w-full space-y-5">
          
          {/* Email Field */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-slate-400 group-focus-within:text-[#ff0000]">
              <UserIcon />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-slate-200 group-hover:border-slate-300'} 
              rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all duration-300 shadow-sm`}
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
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-slate-400 group-focus-within:text-[#ff0000]">
              <LockIcon />
            </div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-slate-200 group-hover:border-slate-300'} 
              rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all duration-300 shadow-sm tracking-widest`}
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
          <div className="flex justify-between items-center px-1 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#ff0000] focus:ring-[#ff0000] transition-colors" />
              <span className="text-slate-600 text-xs font-medium">Remember me</span>
            </label>
            <button type="button" className="text-slate-600 hover:text-[#ff0000] text-xs font-semibold transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#ff0000] hover:bg-[#dd0000] text-white font-bold text-[15px] py-4 rounded-xl shadow-[0_8px_20px_rgba(255,0,0,0.25)] hover:shadow-[0_12px_25px_rgba(255,0,0,0.35)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center"
          >
            {isSubmitting ? "SIGNING IN..." : "Sign In"} 
          </motion.button>
        </form>

        {/* --- SOCIAL LOGIN SECTION --- */}
        <div className="w-full mt-8">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold tracking-wider uppercase">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <motion.button 
              whileHover={{ y: -2, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:border-slate-300 hover:shadow-md"
            >
              <GoogleIcon />
            </motion.button>
            <motion.button 
              whileHover={{ y: -2, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:border-slate-300 hover:shadow-md"
            >
              <GithubIcon />
            </motion.button>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm font-medium">
            New to the platform?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#ff0000] font-semibold hover:text-[#cc0000] transition-colors ml-1"
            >
              Create an account
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
}