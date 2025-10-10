import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import HeaderContext from "../components/context/HeaderContext";
import videoService from "../../Service/video";
import { useNavigate } from "react-router";

const CreatePost = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading,setloading] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate()

  const onSubmit = (data) => {
    setloading(true)
    const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("video", data.videoFile[0]);
        formData.append("thumbnail", data.thumbnail[0]);
    console.log("Form Data:", {...data});
    videoService.uploadVideo(formData).then((res)=>{
      console.log(res)
      if(res.status == 200){
        setloading(false)
        navigate(`/video/${res?.data?.data?._id}`)
      }
    })
  };

  // Handle previews
  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      <div className={`w-full h-full fixed inset-0 backdrop-blur-sm items-center justify-center flex-col gap-2 z-100 ${loading ? "flex" : "hidden"}`}>
          <div class="animate-spin inline-block size-20 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
          </div>
            <span class="text-white font-serif">Video is Uploading Wait....😇</span>
        </div>
    <div
      className={`p-6 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] min-h-screen text-white`}
    >
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Upload New Video
        </h2>
        <p className="text-gray-400 mt-2">Share your awesome content with the world 🌎</p>
        <h1 className="text-red-900">{}</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto backdrop-blur-md bg-white/5 p-8 rounded-2xl shadow-xl space-y-8 border border-gray-700/50"
      >
        <div>
          <label className="block mb-2 font-medium">Video File</label>
          <input
            type="file"
            accept="video/*"
            {...register("videoFile", { required: "Video is required" })}
            onChange={handleVideoChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 w-full cursor-pointer"
          />
          
          {errors.videoFile && (
            <p className="text-red-400 text-sm mt-1">{errors.videoFile.message}</p>
          )}
          {videoPreview && (
            <video
              controls
              src={videoPreview}
              className="mt-4 rounded-xl w-full max-h-64 shadow-md"
            />
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail", { required: "Thumbnail is required" })}
            onChange={handleThumbnailChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 w-full cursor-pointer"
          />
          {errors.thumbnail && (
            <p className="text-red-400 text-sm mt-1">{errors.thumbnail.message}</p>
          )}
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="mt-4 rounded-xl w-64 shadow-md"
            />
          )}
        </div>
      
        
        <div>
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter video title"
            {...register("title", { required: "Title is required" })}
            className="input w-full bg-[#1e1e1e] text-white border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            rows={4}
            placeholder="Write a short description..."
            {...register("description", { required: "Description is required" })}
            className="textarea w-full bg-[#1e1e1e] text-white border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          ></textarea>
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        

        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition"
          >
            🚀 Upload Video
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CreatePost;
