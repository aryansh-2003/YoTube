import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import VideoService from "../../Service/video"; // your backend service

export default function VideoEditPage() {
  const { id } = useParams(); // videoId from URL
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Load video data for editing
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await VideoService.getVideoById({id:id});
        setVideoData(res?.data);
        reset(res?.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideo();
  }, [id, reset]);

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  // Handle update submit
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("visibility", data.visibility);
      if (data.thumbnail[0]) formData.append("thumbnail", data.thumbnail[0]);

      await VideoService.updateVideo(id, formData); // PUT request
      navigate(`/video/${id}`);
    } catch (err) {
      console.error("Error updating video:", err);
    }
  };

  if (!videoData)
    return (
      <div className="text-white text-center mt-20">Loading video details...</div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Edit Video</h1>
        </div>

        {/* Video preview */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-md">
          <video
            src={videoData?.videoUrl}
            controls
            className="w-full rounded-xl"
          />
        </div>

        {/* Edit form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-gray-900 p-6 rounded-xl shadow-md"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Video Title
            </label>
            <input
              {...register("title", { required: true })}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={5}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Visibility
            </label>
            <select
              {...register("visibility")}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                {...register("thumbnail")}
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnailUpload"
              />
              <label
                htmlFor="thumbnailUpload"
                className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-700 transition-all"
              >
                <Upload size={18} />
                <span>Upload New</span>
              </label>
              {thumbnailPreview || videoData?.thumbnailUrl ? (
                <img
                  src={thumbnailPreview || videoData?.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-28 h-16 rounded-lg object-cover border border-gray-700"
                />
              ) : null}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition-all disabled:opacity-50"
            >
              <Save size={18} />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
