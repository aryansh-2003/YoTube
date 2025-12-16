import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import videoService from "../../Service/video";
import { useNavigate } from "react-router";
import { Upload, Image as ImageIcon, ChevronDown, FileVideo, X } from 'lucide-react';

const CreatePost = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      visibility: "Public",
      audience: "No restrictions"
    }
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Watch inputs for character counts
  const titleValue = watch("title");
  const descValue = watch("description");
  
  // Refs for hidden file inputs
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("video", data.videoFile[0]);
      formData.append("thumbnail", data.thumbnail[0]);
      // Add other fields as needed by your backend
      
      const res = await videoService.uploadVideo(formData);
      if (res?.status === 200 && res?.data?.data?._id) {
        navigate(`/video/${res.data.data._id}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setValue("videoFile", e.target.files); // Manually set react-hook-form value
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", e.target.files);
    }
  };

  // Helper styles
  const inputBaseStyle = "w-full bg-transparent border border-[#272727] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-[#E1AD01] transition-colors placeholder-gray-600";
  const labelStyle = "block text-xs font-medium text-gray-400 mb-2";
  const charCountStyle = "text-xs text-gray-500";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pt-6 pb-12 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Upload Video</h1>
          <p className="text-sm text-gray-400">Manage your content and publish to your audience.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Main Card */}
          <div className="bg-[#0f0f0f] border border-[#272727] rounded-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
              
              {/* LEFT COLUMN: Media Upload (Approx 40%) */}
              <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#272727] flex flex-col gap-8">
                
                {/* Video Section */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">Video Source</span>
                    <button type="button" className="text-xs text-[#E1AD01] hover:underline">Import from URL</button>
                  </div>
                  
                  {/* Drag & Drop Area */}
                  <div 
                    className={`relative w-full aspect-[4/3] rounded-lg border-2 border-dashed ${videoPreview ? 'border-[#E1AD01]/50' : 'border-[#272727]'} bg-[#121212] flex flex-col items-center justify-center p-6 group transition-colors hover:bg-[#1a1a1a]`}
                  >
                    {videoPreview ? (
                      <div className="relative w-full h-full">
                        <video src={videoPreview} className="w-full h-full object-contain rounded" controls />
                        <button 
                          type="button"
                          onClick={() => { setVideoPreview(null); setValue("videoFile", null); }}
                          className="absolute -top-3 -right-3 p-1 bg-red-500 rounded-full text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <div className="w-8 h-8 rounded bg-[#E1AD01] flex items-center justify-center text-black">
                            <Upload size={16} strokeWidth={3} />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-white mb-1">Drag and drop video files to upload</p>
                        <p className="text-xs text-gray-500 mb-6 text-center">Your videos will be private until you publish them.</p>
                        
                        <button 
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="px-6 py-2.5 bg-[#E1AD01] hover:bg-[#c29401] text-black text-sm font-bold rounded hover:shadow-[0_0_15px_rgba(225,173,1,0.3)] transition-all"
                        >
                          SELECT FILES
                        </button>
                      </>
                    )}
                    
                    {/* Hidden Input */}
                    <input 
                      type="file" 
                      accept="video/*" 
                      ref={(e) => {
                        register("videoFile", { required: "Video is required" });
                        videoInputRef.current = e;
                      }}
                      onChange={handleVideoChange}
                      className="hidden" 
                    />
                  </div>
                  {errors.videoFile && <span className="text-red-500 text-xs mt-1 block">Video file is required</span>}
                </div>

                {/* Thumbnail Section */}
                <div>
                  <span className="block text-sm font-medium text-white mb-2">Thumbnail</span>
                  <div 
                    className="w-full h-24 rounded-lg border border-[#272727] bg-[#121212] p-2 flex items-center gap-4 cursor-pointer hover:border-gray-600 transition-colors"
                    onClick={() => thumbInputRef.current?.click()}
                  >
                    <div className="h-full aspect-video bg-[#1a1a1a] rounded flex items-center justify-center overflow-hidden">
                      {thumbnailPreview ? (
                         <img src={thumbnailPreview} alt="thumb" className="w-full h-full object-cover" />
                      ) : (
                         <ImageIcon size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-white">Upload thumbnail</span>
                      <span className="text-xs text-gray-500">1280x720 recommended</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={(e) => {
                        register("thumbnail", { required: "Thumbnail is required" });
                        thumbInputRef.current = e;
                      }}
                      onChange={handleThumbnailChange}
                      className="hidden" 
                    />
                  </div>
                  {errors.thumbnail && <span className="text-red-500 text-xs mt-1 block">Thumbnail is required</span>}
                </div>
              </div>

              {/* RIGHT COLUMN: Metadata (Approx 60%) */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col h-full relative">
                
                {/* Scrollable Content Area */}
                <div className="flex-1 space-y-6">
                  
                  {/* Title Input */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className={labelStyle}>Title (required)</label>
                      <span className={charCountStyle}>{titleValue?.length || 0}/100</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Add a title that describes your video"
                      maxLength={100}
                      className={inputBaseStyle}
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <span className="text-red-500 text-xs mt-1">Title is required</span>}
                  </div>

                  {/* Description Input */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className={labelStyle}>Description</label>
                      <span className={charCountStyle}>{descValue?.length || 0}/5000</span>
                    </div>
                    <textarea
                      rows={8}
                      placeholder="Tell viewers about your video"
                      maxLength={5000}
                      className={`${inputBaseStyle} resize-none`}
                      {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && <span className="text-red-500 text-xs mt-1">Description is required</span>}
                  </div>

                  {/* Dropdowns Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Visibility */}
                    <div className="relative">
                      <label className={labelStyle}>Visibility</label>
                      <div className="relative">
                        <select 
                          className={`${inputBaseStyle} appearance-none cursor-pointer`}
                          {...register("visibility")}
                        >
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                          <option value="Unlisted">Unlisted</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                      </div>
                    </div>

                    {/* Audience */}
                    <div className="relative">
                      <label className={labelStyle}>Audience</label>
                      <div className="relative">
                        <select 
                          className={`${inputBaseStyle} appearance-none cursor-pointer`}
                          {...register("audience")}
                        >
                          <option value="No restrictions">No restrictions</option>
                          <option value="Kids">Made for Kids</option>
                          <option value="Adults">Age Restricted</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions Row */}
                <div className="mt-8 pt-6 border-t border-[#272727] flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Checks complete. No issues found.
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button type="button" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                      Save as Draft
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#E1AD01] hover:bg-[#c29401] text-black text-sm font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(225,173,1,0.3)] transition-all"
                    >
                      {loading ? "UPLOADING..." : "PUBLISH"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>

        {/* Bottom Terms */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-600">
            By submitting your videos to ChalChitram, you acknowledge that you agree to ChalChitram's <span className="text-[#E1AD01] cursor-pointer">Terms of Service</span> and <span className="text-[#E1AD01] cursor-pointer">Community Guidelines</span>.
          </p>
          <p className="text-[10px] text-gray-700 mt-2">© 2025 ChalChitram Inc.</p>
        </div>

      </div>
    </div>
  );
};

export default CreatePost;