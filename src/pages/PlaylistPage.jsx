import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import PlaylistCard from "../components/PlaylistCard";
import playlistService from "../../Service/playlist";

export default function PlaylistPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [playList, setPlayList] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    playlistService.getUserPlaylist().then((res) => {
      if (res.status === 200 || res.status === 201) {
        setPlayList(res?.data?.data || []);
      }
    });
  }, [isOpen]);

  const onSubmit = (data) => {
    playlistService
      .createPlaylist({ name: data.name, description: data.description })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          reset();
          setIsOpen(false);
        }
      });
  };

  return (
    <main className="flex-1 bg-black min-h-screen text-white py-6 px-4">
      <div className="flex flex-wrap gap-6 items-start">
        {/* Create Playlist Button */}
        <div
          className="w-40 h-40 bg-gray-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition-transform transform hover:scale-105 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-10 h-10 mb-2 text-white" />
          <span className="text-sm font-medium">Create Playlist</span>
        </div>

        {/* Playlist Cards */}
        {playList.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {playList.map((p, i) => (
              <PlaylistCard key={i} {...p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-6">No playlist yet. Create one now!</p>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-white">
              Create Playlist
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Playlist Name */}
              <div>
                <input
                  type="text"
                  placeholder="Playlist Name"
                  {...register("name", { required: "Playlist name is required" })}
                  className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Playlist Description */}
              <div>
                <textarea
                  placeholder="Description"
                  rows={3}
                  {...register("description", { required: "Description is required" })}
                  className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.description ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-transform transform hover:scale-[1.02]"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
