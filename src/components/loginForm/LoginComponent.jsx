// LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/authSlice";

export default function LoginComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const dispatch = useDispatch();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    if (data) {
      try {
        authService
          .login(data.email, data.password)
          .then((userData) => {
            console.log(userData.status);
            if (userData.status === 401) {
              setError("Check your credentials 😞");
              return
            }
             else if (userData.status === 404) {
              setError("User Doesnt exist 😞");
              return
            }
            dispatch(login(userData?.data?.data));
            navigate("/Home");
          })
          .catch((error) => {
            setError("Something went wrong. Try again later 😞");
          });
      } catch (error) {
        setError("API not responding");
      }
    }

  };
  console.log(error)
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-6">
     
        <div className="absolute top-40 z-200 text-center w-full">
          <h1 className="text-red-800 text-5xl sm:text-base">{error}</h1>
        </div>
  
      <form
        className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-5 sm:space-y-6"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          Sign In
        </h2>

        {/* Email */}
        <div>
          <label
            className="block text-xs sm:text-sm font-medium text-black mb-1"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full px-3 sm:px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base ${
              errors.email ? "border-red-500" : "border-gray-300"
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
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-xs sm:text-sm font-medium text-black mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            className={`w-full px-3 sm:px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 rounded-md font-medium transition-colors text-sm sm:text-base"
        >
          {isSubmitting ? "Signing In…" : "Sign In"}
        </button>

        {/* Link */}
        <p className="text-center text-xs sm:text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-red-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
