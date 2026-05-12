import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial } from "@react-three/drei";

// --- 3D BACKGROUND COMPONENT ---
const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0 bg-slate-50 pointer-events-none">
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const AtSymbolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#ff0000]">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-x-hidden overflow-y-auto font-sans py-16">
      
      <Background3D />
      
      {/* --- GRADIENT OVERLAY --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/70 via-transparent to-red-50/70 z-0 pointer-events-none" />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] px-8 py-10 mx-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col items-center mt-10"
      >
        
        {/* LOGO & HEADINGS */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-4"
          >
            <PlayIcon />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Join the streaming world today
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
        <form onSubmit={handleSubmit(submitHandler)} className="w-full space-y-4">
          
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-slate-400 group-focus-within:text-[#ff0000]">
              <UserIcon />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full bg-white border ${errors.FullName ? 'border-red-500' : 'border-slate-200 group-hover:border-slate-300'} 
              rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all duration-300 shadow-sm`}
              {...register("FullName", { required: "Full Name is required" })}
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-slate-400 group-focus-within:text-[#ff0000]">
              <AtSymbolIcon />
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

          {/* Username */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-slate-400 group-focus-within:text-[#ff0000]">
              <TagIcon />
            </div>
            <input
              type="text"
              placeholder="Username"
              className={`w-full bg-white border ${errors.username ? 'border-red-500' : 'border-slate-200 group-hover:border-slate-300'} 
              rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all duration-300 shadow-sm`}
              {...register("username", { required: "Username is required" })}
            />
          </div>

          {/* Avatar (File Input) */}
          <div className="relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-slate-400 group-focus-within:text-[#ff0000]">
              <PhotoIcon />
            </div>
            <input
              type="file"
              className={`w-full bg-white border ${errors.avatar ? 'border-red-500' : 'border-slate-200 group-hover:border-slate-300'} 
              rounded-xl py-2.5 pl-12 pr-4 text-slate-500 text-sm shadow-sm
              file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold
              file:bg-[#ff0000]/10 file:text-[#ff0000] hover:file:bg-[#ff0000]/20
              focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all duration-300 cursor-pointer`}
              {...register("avatar", { required: "Avatar is required" })}
            />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase pointer-events-none">Avatar</span>
          </div>

          {/* Cover Image (File Input) */}
          <div className="relative group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-slate-400 group-focus-within:text-[#ff0000]">
              <PhotoIcon />
            </div>
            <input
              type="file"
              className="w-full bg-white border border-slate-200 group-hover:border-slate-300 shadow-sm
              rounded-xl py-2.5 pl-12 pr-4 text-slate-500 text-sm
              file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold
              file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200
              focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all duration-300 cursor-pointer"
              {...register("coverImage")}
            />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase pointer-events-none">Cover</span>
          </div>

          {/* Password */}
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

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#ff0000] hover:bg-[#dd0000] text-white font-bold text-[15px] py-4 rounded-xl shadow-[0_8px_20px_rgba(255,0,0,0.25)] hover:shadow-[0_12px_25px_rgba(255,0,0,0.35)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
          >
            {isSubmitting ? "CREATING..." : "Create Account"} 
          </motion.button>
        </form>

        {/* --- FOOTER --- */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-[#ff0000] font-semibold hover:text-[#cc0000] transition-colors ml-1"
            >
              Sign In
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
}