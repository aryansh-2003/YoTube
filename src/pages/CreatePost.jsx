import React, { useState } from "react";
import { useForm } from "react-hook-form";
import videoService from "../../Service/video";
import { useNavigate } from "react-router";

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
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-lg bg-black/40 z-50 text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
          <span className="font-semibold text-lg tracking-wide">
            Uploading your masterpiece 🚀
          </span>
          <p className="text-sm text-gray-300">
            This might take a few seconds...
          </p>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-[#0c0c0c] via-[#151515] to-[#1f1f1f] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,100,100,0.4)]">
              Upload Your Video
            </h2>
            <p className="text-gray-400 mt-3 text-sm tracking-wide">
              Share your story with the world — high quality, fast, and secure ✨
            </p>
            {uploadError && (
              <p className="mt-4 text-red-400 font-medium">{uploadError}</p>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(255,80,80,0.1)] space-y-8 transition-all"
          >
            {/* Video Upload */}
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wide text-gray-300">
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                {...register("videoFile", { required: "Video is required" })}
                onChange={handleVideoChange}
                className="w-full text-sm cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r from-red-600 to-pink-600 file:text-white hover:file:opacity-90 transition"
              />
              {errors.videoFile && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.videoFile.message}
                </p>
              )}
              {videoPreview && (
                <video
                  controls
                  src={videoPreview}
                  className="mt-4 rounded-xl w-full max-h-72 border border-white/10 shadow-lg hover:shadow-red-500/30 transition"
                />
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wide text-gray-300">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("thumbnail", { required: "Thumbnail is required" })}
                onChange={handleThumbnailChange}
                className="w-full text-sm cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r from-red-600 to-pink-600 file:text-white hover:file:opacity-90 transition"
              />
              {errors.thumbnail && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.thumbnail.message}
                </p>
              )}
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mt-4 rounded-xl w-64 border border-white/10 shadow-md hover:shadow-red-400/30 transition"
                />
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wide text-gray-300">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter video title"
                {...register("title", { required: "Title is required" })}
                className="w-full bg-[#181818] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold text-sm uppercase tracking-wide text-gray-300">
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Write a short description..."
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full bg-[#181818] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              ></textarea>
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-500 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-10 rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
              >
                🚀 {loading ? "Uploading..." : "Upload Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
