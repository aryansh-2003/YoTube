import React, { useState } from "react";
import { useForm } from "react-hook-form";
import videoService from "../../Service/video";
import { useNavigate } from "react-router";
import {Vortex} from '../components/ui/vortex'

const CreatePost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setUploadError(null);
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("video", data.videoFile[0]);
      formData.append("thumbnail", data.thumbnail[0]);

      const res = await videoService.uploadVideo(formData);

      if (res?.status === 200 && res?.data?.data?._id) {
        navigate(`/video/${res.data.data._id}`);
      } else {
        throw new Error("Unexpected server response.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Something went wrong during upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files?.[0]) {
      setVideoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files?.[0]) {
      setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 backdrop-blur-xl bg-black/90 z-50 text-white">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-white/20 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <span className="font-semibold text-xl text-white/90">
              Uploading Your Video
            </span>
            <p className="text-sm text-white/50 mt-2">
              Please wait...
            </p>
          </div>
        </div>
      )}
    

      <div className="min-h-screen bg-[#0a0a0a] py- px-6 relative overflow-hidden">
        {/* Sophisticated ambient background */}

         <Vortex
                backgroundColor="black"
                rangeY={800}
                particleCount={500}
                baseHue={120}
                className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
              > 
        <div className="relative z-10 max-w-4xl mx-auto pt-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-white/90 mb-3">
              Upload Video
            </h2>
            <p className="text-white/50 text-sm">
              Share your content with the world
            </p>

            {uploadError && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-red-400 text-sm">{uploadError}</p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="relative min-w-2xl">
             
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-8 rounded-xl space-y-8">
              
              {/* Video Upload */}
              <div className="relative">
                <label className="block mb-3 font-medium text-sm text-white">
                  Video File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    {...register("videoFile", { required: "Video is required" })}
                    onChange={handleVideoChange}
                    className="w-full text-sm cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:bg-violet-500/20 file:text-white/90 file:font-medium file:border file:border-violet-500/30 hover:file:bg-violet-500/30 transition-all bg-white/[0.02] rounded-lg border border-white/10 p-2"
                  />
                </div>
                {errors.videoFile && (
                  <p className="text-red-400 text-xs mt-2">{errors.videoFile.message}</p>
                )}
                {videoPreview && (
                  <div className="mt-4">
                    <video
                      controls
                      src={videoPreview}
                      className="w-full max-h-72 rounded-lg border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="relative">
                <label className="block mb-3 font-medium text-sm text-white">
                  Thumbnail
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("thumbnail", { required: "Thumbnail is required" })}
                    onChange={handleThumbnailChange}
                    className="w-full text-sm cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-white/90 file:font-medium file:border file:border-blue-500/30 hover:file:bg-blue-500/30 transition-all bg-white/[0.02] rounded-lg border border-white/10 p-2"
                  />
                </div>
                {errors.thumbnail && (
                  <p className="text-red-400 text-xs mt-2">{errors.thumbnail.message}</p>
                )}
                {thumbnailPreview && (
                  <div className="mt-4 inline-block">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-64 rounded-lg border border-white/10"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="relative">
                <label className="block mb-3 font-medium text-sm text-white">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  {...register("title", { required: "Title is required" })}
                  className="w-full bg-white/[0.02] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/20 transition-all placeholder-white/30"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-2">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="relative">
                <label className="block mb-3 font-medium text-sm text-white">
                  Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your video"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full bg-white/[0.02] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/20 transition-all resize-none placeholder-white/30"
                ></textarea>
                {errors.description && (
                  <p className="text-red-400 text-xs mt-2">{errors.description.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium text-base py-3 px-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Uploading..." : "Upload Video"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Vortex>
      </div>
    </>
  );
};

export default CreatePost;