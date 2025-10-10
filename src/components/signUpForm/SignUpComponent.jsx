// LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../Service/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../Store/authSlice";

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
    if (data){
        console.log(data.FullName)
           const formData = new FormData();
            formData.append("fullname", data.FullName);
            formData.append("email", data.email);
            formData.append("username", data.username);
            formData.append("password", data.password);
            formData.append("avatar", data.avatar[0]);
            formData.append("coverImage", data.coverImage[0]);

            console.log(...formData)

        authService.registerUser(formData).then((res)=>{
            console.log(res.status)
            navigate('/')
        }).catch((error)=>{console.log(error)})
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-6">
      {error && (
        <div className="absolute top-4 text-center w-full">
          <h1 className="text-red-800 text-sm sm:text-base">{error}</h1>
        </div>
      )}
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
            htmlFor="text"
          >
            Full Name
          </label>
          <input
            id="FullName"
            type="text"
            placeholder="Aryansh dixit"
            className={`w-full px-3 sm:px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base ${
              errors.FullName ? "border-red-500" : "border-gray-300"
            }`}
            {...register("FullName", {
              required: "FullName is required",
            })}
          />
          {errors.FullName && (
            <p className="mt-1 text-xs text-red-600">
              {errors.FullName.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-xs sm:text-sm font-medium text-black mb-1"
            htmlFor="password"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="123@gmail.com"
            className={`w-full px-3 sm:px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Enter a valid email"
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

            <div>
          <label
            className="block text-xs sm:text-sm font-medium text-black mb-1"
            htmlFor="file"
          >
            Avatar
          </label>
          <input
            id="avatar"
            type="file"
            placeholder="Your avatar"
            className={`w-full px-3 sm:px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base ${
              errors.avatar ? "border-red-500" : "border-gray-300"
            }`}
            {...register("avatar", {
              required: "Avatar is required",
            })}
          />
          {errors.avatar && (
            <p className="mt-1 text-xs text-red-600">
              {errors.avatar.message}
            </p>
          )}
        </div>

            <div>
          <label
            className="block text-xs sm:text-sm font-medium text-black mb-1"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="Text"
            placeholder="Your Username"
            className={`w-full px-3 sm:px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            {...register("username", {
              required: "Username is required",
            })}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>


            <div>
          <label
            className="block text-xs sm:text-sm font-medium text-black mb-1"
            htmlFor="password"
          >
            CoverImage
          </label>
          <input
            id="coverImage"
            type="file"
            placeholder="Your coverImage"
            className={`w-full px-3 sm:px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("coverImage",)}
          />
          {errors.coverImage && (
            <p className="mt-1 text-xs text-red-600">
              {errors.coverImage.message}
            </p>
          )}
        </div>



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
          <button className="text-red-600 hover:underline" onClick={() => navigate('/')}>
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}
