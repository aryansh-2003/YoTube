import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import PlaylistCard from "../components/PlaylistCard";
import playlistService from "../../Service/playlist";


export default function PlaylistPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [playList, setPlayList] = useState()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  useEffect(() => {
    playlistService.getUserPlaylist().then((res) => {
      console.log(res)
      if(res.status === 200 || 201) {
        setPlayList(res?.data?.data)
      }
    })
  },[isOpen])



  const onSubmit = (data) => {
    console.log( data.name,data.description);
    const formData = new FormData()
    formData.append("name",data.name)
    formData.append("description",data.description)
    playlistService.createPlaylist({name:data.name,description:data.description}).then((res)=>{
      if(res.status === 200 || 201){
           reset();
          setIsOpen(false);
      }
    })
    
 
  };

  return (
    <main className="flex-1 bg-black pt-2 min-h-screen text-white">
      <div className=" pl-5 flex gap-4 flex-wrap">
        {/* Create Playlist Button */}
        <div
          className="w-[20%]  mt-5 bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Create Playlist</span>
        </div>

        {/* Example placeholder playlists */}
         <div className="flex flex-wrap gap-6 justify-center sm:justify-start p-4">
        {playList ? 
        <>
        {playList.map((p, i) => (
          <PlaylistCard key={i} {...p} />
        ))}
        </> : "...No playlist yet Create Your one now"}
        </div>
      
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Create Playlist
            </h2>

            {/* ✅ Form using React Hook Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Title Input */}
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

              {/* Description Input */}
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Playlist cards below */}
    
    </main>
  );
}
