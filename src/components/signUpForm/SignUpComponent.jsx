import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/authSlice";
import { motion } from "framer-motion";

export default function SignUpComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
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
            navigate("/");
          }
      }).catch((err) => {
        console.error(err.status);
         if (err.status === 409) {
            setError("User already exists with email or username 😞");
          } else {
            setError("Something went wrong. Please try again later.");
          }
      })
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
      {/* Animated Card */}
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-white tracking-wide">
          Create Your Account
        </h2>

        {error && (
          <div className="text-center text-sm text-red-400 bg-red-950/20 border border-red-700/40 py-2 px-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="FullName">
            Full Name
          </label>
          <input
            id="FullName"
            type="text"
            placeholder="Aryansh Dixit"
            className={`w-full px-4 py-2 bg-transparent border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.FullName ? "border-red-500" : "border-gray-600"
            }`}
            {...register("FullName", { required: "Full name is required" })}
          />
          {errors.FullName && (
            <p className="mt-1 text-xs text-red-400">{errors.FullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="123@gmail.com"
            className={`w-full px-4 py-2 bg-transparent border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-600"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Enter a valid email address"
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Your username"
            className={`w-full px-4 py-2 bg-transparent border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.username ? "border-red-500" : "border-gray-600"
            }`}
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
          )}
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="avatar">
            Avatar
          </label>
          <input
            id="avatar"
            type="file"
            className={`w-full px-3 py-2 bg-transparent border rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.avatar ? "border-red-500" : "border-gray-600"
            }`}
            {...register("avatar", { required: "Avatar is required" })}
          />
          {errors.avatar && (
            <p className="mt-1 text-xs text-red-400">{errors.avatar.message}</p>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="coverImage">
            Cover Image
          </label>
          <input
            id="coverImage"
            type="file"
            className={`w-full px-3 py-2 bg-transparent border rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.coverImage ? "border-red-500" : "border-gray-600"
            }`}
            {...register("coverImage")}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            className={`w-full px-4 py-2 bg-transparent border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-600"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Must be at least 6 characters" }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.96 }}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 transition-colors text-white font-semibold shadow-md"
        >
          {isSubmitting ? "Creating Account…" : "Sign Up"}
        </motion.button>

        {/* Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-blue-400 hover:underline"
          >
            Log in
          </button>
        </p>
      </motion.form>
    </div>
  );
}
