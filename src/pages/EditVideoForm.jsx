import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Copy, Upload, ChevronDown, CheckCircle2, Image as ImageIcon, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import VideoService from "../../Service/video";
import { useDispatch } from "react-redux";
import { vdo } from "../Store/videoSlice";
import MachineLoader from '../components/loader/MachineLoader';

export default function VideoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loader, setLoader] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      visibility: "true", // Default to Public (string to match select value)
      audience: "No restrictions" 
    }
  });

  // Watch for character counts
  const titleValue = watch("title");
  const descValue = watch("description");

  // Load video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await VideoService.getSingleVideo({ id: id });
        if (res?.data?.data) {
          const data = res.data.data;
          setVideoData(data);
          // Set form defaults
          reset({
            title: data.title || "",
            description: data.description || "",
            visibility: data.isPublished ? "true" : "false",
            audience: "No restrictions" // Default fallback
          });
          if(data.thumbnail) setThumbnailPreview(data.thumbnail);
        }
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };
    fetchVideo();
  }, [id, reset]);

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", e.target.files);
    }
  };

  // Handle Submit
  const onSubmit = async (data) => {
    setLoader(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      // Convert string "true"/"false" back to boolean for backend if needed, or keep as is depending on API
      formData.append("isPublished", data.visibility); 
      
      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const res = await VideoService.updateVideo({ id: id }, formData);
      if (res.status === 200 || res.status === 201) {
        dispatch(vdo(res?.data?.data));
        navigate(`/video/${res?.data?.data?._id}`);
      }
    } catch (err) {
      console.error("Error updating video:", err);
    } finally {
      setLoader(false);
    }
  };

  // Helper styles
  const inputBaseStyle = "w-full bg-[#0f0f0f] border border-[#272727] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-white/40 transition-colors placeholder-gray-600";
  const labelStyle = "block text-xs font-bold text-gray-400 mb-2";
  const sectionBoxStyle = "bg-[#1f1f1f] rounded-xl border border-[#272727] overflow-hidden";

  if (!videoData) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* Loader Overlay */}
      {loader && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm">
          <MachineLoader />
        </div>
      )}

      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur border-b border-[#272727] px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Edit Video Details</h1>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate(-1)}
               className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
             >
               Cancel
             </button>
             <button 
               onClick={handleSubmit(onSubmit)}
               disabled={isSubmitting}
               className="px-6 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
             >
               {isSubmitting ? "Saving..." : "Save Changes"}
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Media Preview (Approx 35%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Video Player Box */}
            <div className={sectionBoxStyle}>
              <div className="relative aspect-video bg-black group">
                <video 
                  src={videoData.videoFile} 
                  className="w-full h-full object-contain opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 bg-white/10 backdrop-blur rounded-full">
                       <Play size={32} fill="white" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-mono">
                  {/* Duration placeholder or real data */}
                  00:00
                </div>
              </div>

              <div className="p-4 space-y-4 bg-[#1a1a1a]">
                {/* Video Link */}
                <div className="space-y-1">
                   <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Video Link</span>
                   <div className="flex items-center justify-between bg-[#0f0f0f] rounded border border-[#272727] p-2">
                      <a href="#" className="text-blue-400 text-xs truncate max-w-[200px] hover:underline">
                        https://chalchitram.com/v/{videoData._id}
                      </a>
                      <button className="text-gray-500 hover:text-white">
                        <Copy size={14} />
                      </button>
                   </div>
                </div>

                {/* Filename */}
                <div className="space-y-1">
                   <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Filename</span>
                   <p className="text-xs text-white truncate font-mono">
                     {videoData.videoFile?.split('/').pop() || "original_video_file.mp4"}
                   </p>
                </div>
              </div>
            </div>

            {/* Thumbnail Section */}
            <div className={`p-4 ${sectionBoxStyle} bg-[#1a1a1a]`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm">Thumbnail</span>
                <button 
                   type="button"
                   onClick={() => fileInputRef.current?.click()}
                   className="text-xs text-[#E1AD01] font-medium hover:underline cursor-pointer"
                >
                  Select image
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Set a thumbnail that stands out and draws viewers' attention.
              </p>

              {/* Main Upload Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full aspect-video rounded-lg border border-dashed border-[#3a3a3a] hover:border-[#E1AD01]/50 bg-[#0f0f0f] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
              >
                {thumbnailPreview ? (
                   <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={24} className="text-gray-500 mb-2 group-hover:text-[#E1AD01] transition-colors" />
                    <span className="text-xs text-gray-500">Upload file</span>
                  </>
                )}
                
                {/* Hidden Input */}
                <input 
                  type="file" 
                  ref={(e) => {
                    register("thumbnail");
                    fileInputRef.current = e;
                  }}
                  onChange={handleThumbnailChange}
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              {/* Small auto-generated placeholders (Mock visual) */}
              <div className="grid grid-cols-3 gap-2 mt-3 opacity-50 pointer-events-none">
                 <div className="aspect-video bg-[#272727] rounded"></div>
                 <div className="aspect-video bg-[#272727] rounded"></div>
                 <div className="aspect-video bg-[#272727] rounded"></div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form Data (Approx 65%) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title Input */}
            <div className={sectionBoxStyle}>
               <div className="p-4 bg-[#1a1a1a]">
                  <div className="flex justify-between mb-1">
                    <label className={labelStyle}>Title (required)</label>
                    <span className="text-gray-500 text-xs hover:text-white cursor-help">?</span>
                  </div>
                  <div className="relative">
                    <input
                      {...register("title", { required: true, maxLength: 100 })}
                      className={`${inputBaseStyle} pr-16`}
                      placeholder="My Awesome Video Project"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      {titleValue?.length || 0}/100
                    </span>
                  </div>
               </div>
            </div>

            {/* Description Input */}
            <div className={sectionBoxStyle}>
               <div className="p-4 bg-[#1a1a1a]">
                  <div className="flex justify-between mb-1">
                    <label className={labelStyle}>Description</label>
                    <span className="text-gray-500 text-xs hover:text-white cursor-help">?</span>
                  </div>
                  <div className="relative">
                    <textarea
                      {...register("description", { maxLength: 5000 })}
                      rows={8}
                      className={`${inputBaseStyle} resize-none pb-6`}
                      placeholder="Tell viewers about your video"
                    />
                    <span className="absolute right-3 bottom-3 text-xs text-gray-500">
                      {descValue?.length || 0}/5000
                    </span>
                  </div>
               </div>
            </div>

            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visibility */}
                <div>
                   <label className={labelStyle}>Visibility</label>
                   <div className="relative">
                      <select 
                        {...register("visibility")}
                        className={`${inputBaseStyle} appearance-none cursor-pointer bg-[#1a1a1a]`}
                      >
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                         {/* Icon changes based on selection conceptually */}
                         <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                         </div>
                      </div>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      {/* Indent text to make room for icon */}
                      <style jsx>{`select[name="visibility"] { text-indent: 1.5rem; }`}</style>
                   </div>
                </div>

                {/* Audience */}
                <div>
                   <label className={labelStyle}>Audience</label>
                   <div className="relative">
                      <select 
                        {...register("audience")}
                        className={`${inputBaseStyle} appearance-none cursor-pointer bg-[#1a1a1a]`}
                      >
                        <option value="No restrictions">No restrictions</option>
                        <option value="Kids">Made for Kids</option>
                        <option value="Not for Kids">Not for Kids</option>
                      </select>
                       <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                           {/* Simple face icon */}
                           <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center relative overflow-hidden">
                              <div className="w-full h-1/2 bg-gray-400 absolute bottom-0"></div>
                           </div>
                       </div>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      <style jsx>{`select[name="audience"] { text-indent: 1.5rem; }`}</style>
                   </div>
                </div>
            </div>

            {/* Footer Status */}
            <div className="pt-4 border-t border-[#272727] flex items-center gap-2 text-gray-500">
               <CheckCircle2 size={16} className="text-gray-500" />
               <span className="text-xs">Checks complete. No issues found.</span>
            </div>

          </div>
        </div>

        {/* Footer Copyright */}
        <div className="mt-12 text-center border-t border-[#272727] pt-6">
           <p className="text-xs text-gray-600">
             © 2025 ChalChitram Inc. We <span className="text-red-900">♥</span> Creators.
           </p>
        </div>
      </div>
    </div>
  );
}