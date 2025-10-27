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
      {/* Loading Overlay - Anime Style */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 backdrop-blur-xl bg-black/80 z-50 text-white">
          {/* Animated sakura petals */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-pink-400 opacity-60 text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  animation: `fall ${Math.random() * 3 + 4}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                🌸
              </div>
            ))}
          </div>

          <style>{`
            @keyframes fall {
              to { transform: translateY(100vh) rotate(360deg); }
            }
            @keyframes rotate-blade {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.5); }
              50% { box-shadow: 0 0 50px rgba(249, 115, 22, 0.8); }
            }
          `}</style>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div 
              className="relative w-20 h-20 border-4 border-transparent border-t-orange-500 border-r-pink-500 rounded-full"
              style={{ animation: 'rotate-blade 1s linear infinite' }}
            ></div>
          </div>

          <div className="relative text-center">
            <span className="font-bold text-2xl tracking-wide bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Uploading Your Masterpiece
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-3xl">⚔️</span>
              <span className="text-3xl">🔥</span>
              <span className="text-3xl">🌸</span>
            </div>
          </div>
          <p className="text-sm text-slate-300 animate-pulse">
            Channeling your creative energy...
          </p>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white py-12 px-6 relative overflow-hidden">
        {/* Falling petals background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-300 opacity-20 text-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animation: `fall ${Math.random() * 15 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              🌸
            </div>
          ))}
        </div>

        {/* Katana decorations */}
        <div className="fixed top-20 right-10 opacity-5 pointer-events-none z-0" style={{ animation: 'rotate-blade 30s linear infinite' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <line x1="10" y1="90" x2="90" y2="10" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
            <line x1="15" y1="85" x2="85" y2="15" stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="10" cy="90" r="6" fill="#fbbf24"/>
          </svg>
        </div>
        <div className="fixed bottom-20 left-10 opacity-5 pointer-events-none z-0" style={{ animation: 'rotate-blade 25s linear infinite reverse' }}>
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <line x1="20" y1="10" x2="80" y2="90" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round"/>
            <line x1="25" y1="15" x2="75" y2="85" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="20" cy="10" r="6" fill="#f472b6"/>
          </svg>
        </div>

        {/* Glowing orbs */}
        <div className="fixed top-1/4 left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl animate-pulse pointer-events-none z-0"></div>
        <div className="fixed bottom-1/4 right-10 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" style={{ animation: 'pulse 3s ease-in-out infinite' }}></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header with anime style */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-6xl opacity-20">⚔️</div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 blur-2xl opacity-50"></div>
              <h2 className="relative text-6xl font-black bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl mb-4">
                Upload Your Video
              </h2>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl">🔥</span>
              <p className="text-slate-300 text-base tracking-wide font-medium">
                Share your story with the world
              </p>
              <span className="text-2xl">🌸</span>
            </div>

            {uploadError && (
              <div className="mt-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-red-300 font-semibold">{uploadError}</p>
              </div>
            )}
          </div>

          {/* Form with anime design */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative"
          >
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full mb-6 shadow-lg shadow-orange-500/50"></div>

            <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-orange-500/30 p-8 rounded-3xl shadow-2xl shadow-orange-500/20 space-y-8">
              {/* Video Upload with anime styling */}
              <div className="relative group">
                <label className="flex items-center gap-2 mb-3 font-bold text-sm uppercase tracking-wider text-orange-300">
                  <span className="text-xl">🎬</span>
                  Video File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    {...register("videoFile", { required: "Video is required" })}
                    onChange={handleVideoChange}
                    className="w-full text-sm cursor-pointer file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-orange-500 file:via-pink-500 file:to-purple-500 file:text-white file:font-bold file:shadow-lg hover:file:shadow-orange-500/50 transition-all bg-slate-800/50 rounded-xl border-2 border-slate-700/50 p-2"
                  />
                </div>
                {errors.videoFile && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.videoFile.message}
                  </p>
                )}
                {videoPreview && (
                  <div className="mt-4 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <video
                      controls
                      src={videoPreview}
                      className="relative w-full max-h-72 rounded-2xl border-2 border-orange-500/30 shadow-2xl"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="relative group">
                <label className="flex items-center gap-2 mb-3 font-bold text-sm uppercase tracking-wider text-pink-300">
                  <span className="text-xl">🖼️</span>
                  Thumbnail
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("thumbnail", { required: "Thumbnail is required" })}
                    onChange={handleThumbnailChange}
                    className="w-full text-sm cursor-pointer file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-pink-500 file:via-purple-500 file:to-blue-500 file:text-white file:font-bold file:shadow-lg hover:file:shadow-pink-500/50 transition-all bg-slate-800/50 rounded-xl border-2 border-slate-700/50 p-2"
                  />
                </div>
                {errors.thumbnail && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.thumbnail.message}
                  </p>
                )}
                {thumbnailPreview && (
                  <div className="mt-4 relative group inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="relative w-64 rounded-2xl border-2 border-pink-500/30 shadow-2xl"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="relative">
                <label className="flex items-center gap-2 mb-3 font-bold text-sm uppercase tracking-wider text-purple-300">
                  <span className="text-xl">✍️</span>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter your epic title..."
                  {...register("title", { required: "Title is required" })}
                  className="w-full bg-slate-800/60 text-white border-2 border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-500"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="relative">
                <label className="flex items-center gap-2 mb-3 font-bold text-sm uppercase tracking-wider text-blue-300">
                  <span className="text-xl">📝</span>
                  Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell your story..."
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full bg-slate-800/60 text-white border-2 border-blue-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder-slate-500"
                ></textarea>
                {errors.description && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.description.message}
                  </p>
                )}
              </div>

              {/* Submit Button - Anime Style */}
              <div className="text-center pt-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-all"></div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-black text-lg py-4 px-12 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-70 border-2 border-orange-400/50"
                    style={{ animation: loading ? '' : 'pulse-glow 2s infinite' }}
                  >
                    <span className="flex items-center gap-3">
                      {loading ? (
                        <>
                          <span className="animate-spin">⚡</span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          Upload Video
                          <span>⚔️</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mt-6 shadow-lg shadow-purple-500/50"></div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;