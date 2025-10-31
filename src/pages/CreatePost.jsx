import React, { useState } from "react";
import { useForm } from "react-hook-form";
import videoService from "../../Service/video";
import { useNavigate } from "react-router";
import { Vortex } from '../components/ui/vortex';
import { motion } from 'framer-motion';

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex flex-col items-center justify-center gap-6 backdrop-blur-xl bg-black/90 z-50 text-white"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-3 border-white/20 border-t-violet-500 rounded-full"
            />
          </div>
          <div className="text-center px-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-semibold text-xl text-white/90 block"
            >
              Uploading Your Video
            </motion.span>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-white/50 mt-2"
            >
              Please wait...
            </motion.p>
          </div>
        </motion.div>
      )}

      <div className="min-h-screen bg-[#0a0a0a] py- sm:py-6 px-4 sm:px-6 relative overflow-hidden">
        {/* Vortex Background */}
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="flex items-center flex-col justify-center px-2 md:px-10 py- w-full h-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-4xl mx-auto  mt-10"
          >
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 px-4">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-semibold text-white/90 mb-3"
              >
                Upload Video
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/50 text-sm"
              >
                Share your content with the world
              </motion.p>

              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm"
                >
                  <p className="text-red-400 text-sm">{uploadError}</p>
                </motion.div>
              )}
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className="relative w-full"
            >
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-4 sm:p-8 rounded-xl space-y-6 sm:space-y-8">
                {/* Video Upload */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <label className="block mb-3 font-medium text-sm text-white">
                    Video File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      {...register("videoFile", { required: "Video is required" })}
                      onChange={handleVideoChange}
                      className="w-full text-xs sm:text-sm cursor-pointer file:mr-2 sm:file:mr-4 file:py-2 sm:file:py-2.5 file:px-3 sm:file:px-5 file:rounded-lg file:border-0 file:bg-violet-500/20 file:text-white/90 file:font-medium file:border file:border-violet-500/30 hover:file:bg-violet-500/30 transition-all bg-white/[0.02] rounded-lg border border-white/10 p-2"
                    />
                  </div>
                  {errors.videoFile && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-2"
                    >
                      {errors.videoFile.message}
                    </motion.p>
                  )}
                  {videoPreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <video
                        controls
                        src={videoPreview}
                        className="w-full max-h-48 sm:max-h-72 rounded-lg border border-white/10"
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Thumbnail Upload */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <label className="block mb-3 font-medium text-sm text-white">
                    Thumbnail
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      {...register("thumbnail", { required: "Thumbnail is required" })}
                      onChange={handleThumbnailChange}
                      className="w-full text-xs sm:text-sm cursor-pointer file:mr-2 sm:file:mr-4 file:py-2 sm:file:py-2.5 file:px-3 sm:file:px-5 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-white/90 file:font-medium file:border file:border-blue-500/30 hover:file:bg-blue-500/30 transition-all bg-white/[0.02] rounded-lg border border-white/10 p-2"
                    />
                  </div>
                  {errors.thumbnail && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-2"
                    >
                      {errors.thumbnail.message}
                    </motion.p>
                  )}
                  {thumbnailPreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="w-full sm:w-64 rounded-lg border border-white/10"
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label className="block mb-3 font-medium text-sm text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter video title"
                    {...register("title", { required: "Title is required" })}
                    className="w-full bg-white/[0.02] text-white border border-white/10 rounded-lg px-4 py-2.5 sm:py-3 focus:outline-none focus:border-white/20 transition-all placeholder-white/30 text-sm sm:text-base"
                  />
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-2"
                    >
                      {errors.title.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <label className="block mb-3 font-medium text-sm text-white">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your video"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="w-full bg-white/[0.02] text-white border border-white/10 rounded-lg px-4 py-2.5 sm:py-3 focus:outline-none focus:border-white/20 transition-all resize-none placeholder-white/30 text-sm sm:text-base"
                  ></textarea>
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs mt-2"
                    >
                      {errors.description.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center pt-4"
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium text-sm sm:text-base py-3 px-8 sm:px-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Uploading..." : "Upload Video"}
                  </motion.button>
                </motion.div>
              </div>
            </motion.form>
          </motion.div>
        </Vortex>
      </div>
    </>
  );
};

export default CreatePost;