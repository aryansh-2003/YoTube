// LoginForm.jsx
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
          setError("User doesn’t exist 😞");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white relative overflow-hidden">
      {/* Floating brand logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-10 flex flex-col items-center gap-2"
      >
        <img
          src={chalchitram}
          alt="chalchitram"
          className="w-16 sm:w-20 opacity-90"
        />
        <img
          src={chalChitramText}
          alt="chalchitram-text"
          className="w-28 sm:w-36"
        />
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-32 z-50 text-center w-full"
        >
          <p className="text-red-400 text-sm sm:text-base font-medium bg-red-950/30 backdrop-blur-md inline-block px-4 py-2 rounded-md border border-red-800/50">
            {error}
          </p>
        </motion.div>
      )}

      {/* Glassmorphic Form */}
      <motion.form
        onSubmit={handleSubmit(submitHandler)}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[90%] sm:w-[380px] bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 space-y-6 relative z-10"
      >
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Sign In
        </h2>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-2.5 rounded-md bg-white/5 text-white placeholder-gray-400 border ${
              errors.email ? "border-red-500" : "border-white/20"
            } focus:outline-none focus:ring-2 focus:ring-red-500/60 transition`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            className={`w-full px-4 py-2.5 rounded-md bg-white/5 text-white placeholder-gray-400 border ${
              errors.password ? "border-red-500" : "border-white/20"
            } focus:outline-none focus:ring-2 focus:ring-red-500/60 transition`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.96 }}
          className="w-full py-2.5 text-white font-medium rounded-md bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 transition disabled:opacity-50"
        >
          {isSubmitting ? "Signing In…" : "Sign In"}
        </motion.button>

        {/* Link */}
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-red-400 hover:text-red-300 underline-offset-2 hover:underline transition"
          >
            Sign Up
          </button>
        </p>
      </motion.form>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-red-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-pink-600/20 blur-[100px] rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
