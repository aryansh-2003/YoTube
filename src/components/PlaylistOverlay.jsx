import { ArrowRightCircle, Check, X } from "lucide-react";
import playlistService from "../../Service/playlist";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function PlaylistOverlay({ onClose, onSelect, videoId }) {
  console.log(videoId)
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [message, setMessage] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    playlistService.getUserPlaylist().then((res) => {
      if (res.status === 200 || res.status === 201) {
        setPlaylists(res?.data?.data || []);
      }
    });
  }, []);

  const handlePlaylistClick = (playlist) => {
    if (selectedPlaylistId === playlist._id) {
      setSelectedPlaylistId(null);
      setValue("playlistId", ""); // clear the form value
    } else {
      setSelectedPlaylistId(playlist._id);
      setValue("playlistId", playlist._id); // update the form value
    }
  };

  const displayMessage = () =>{
    setMessage(true)
     
  }

  const onSubmit = (data) => {
    if (data.playlistId) {
      console.log(data.playlistId,videoId)
      playlistService.addVideoToPlaylist({playlistId:data.playlistId,videoId:videoId}).then((res) => {
        if(res.status === 200 || 201){
          displayMessage()
        }
      })
    }
   
  };

  

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

{!message ?  <>    <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Add to Playlist</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {playlists && playlists.length > 0 ? (
            playlists.map((playlist) => {
              const isSelected = selectedPlaylistId === playlist._id;
              return (
                <div
                  key={playlist._id}
                  className={`flex justify-between items-center px-4 py-3 cursor-pointer transition ${
                    isSelected
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  <span
                    className={`font-medium ${
                      isSelected ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {playlist.name}
                  </span>
                  <span
                    className={`text-sm ${
                      isSelected ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {playlist.videosCount} videos
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              No playlists found.
            </div>
          )}
      </div>

        

        {/* Hidden input for selected playlist */}
        <input type="hidden" {...register("playlistId")} />

        {/* Footer */}
        <div className="border-t px-4 py-3">
          <button
            type="submit"
            disabled={!selectedPlaylistId}
            className={`w-full font-semibold py-2 rounded-lg transition ${
              selectedPlaylistId
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Add Video
          </button>
        </div>
      </form> </> : ""}

        {message ?
                   <>
                   <div className="w-[30%] h-[30%] text-black flex-col   bg-white flex items-center justify-center">
                      <Check color="green" size={50}/>
                       <h1 className="font-serif text-xl">Video Added Succesfully</h1>
                   </div>
                  </> : ""}
    </div>

              
  );
}
