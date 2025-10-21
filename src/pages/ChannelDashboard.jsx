import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import HeaderContext from "../components/context/HeaderContext";
import defaultAvatar from "../assets/download.jpeg";
import defaultCover from "../assets/defaultCover.jpg";
import dashboardService from "../../Service/dashboard";
import authService from "../../Service/auth";
import videoService from "../../Service/video";
import VideoCard from '../components/video/VideoCard'



export default function ChannelDashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const { sidebarOpen } = useContext(HeaderContext);

  const [enlargedImage, setEnlargedImage] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [videos, setvideos] = useState(null);


  useEffect(() => {
     if(!userData) return
    dashboardService.getDashboard().then((res) => {
      if (res.status === 200 || res.status === 201) {
        setDashboardData(res?.data?.data);
      }
    });
    dashboardService.getChannelVideos(userData._id).then((res)=>{
        console.log(res)
        setvideos(res?.data?.data)
      })
  }, [userData]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      if (type === "avatar") {
        setPreviewAvatar(url);
        setAvatarFile(file); // ✅ store actual avatar file
      } else {
        setPreviewCover(url);
        setCoverFile(file); // ✅ store actual cover file
      }
    }
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeEnlarged = () => {
    setEnlargedImage(null);
  };

  const handleSaveChanges = () => {

    const formData = new FormData()

     if(avatarFile){
          formData.append("avatar",avatarFile)
          authService.changeAvatar(formData).then((res) => {
            console.log(res)
          })
      }else{
          formData.append("coverImage",coverFile)
          authService.changeCoverimage(formData).then((res) => {
            console.log(res)
          })
      }
  }

  return (
    <main className="pt-4">
      {/* COVER IMAGE */}
      <div className="w-full rounded-2xl h-48 bg-gray-800 relative">
        <img
          src={previewCover || userData?.coverImage || defaultCover}
          alt="cover"
          className="w-full h-full rounded-b-2xl object-cover cursor-pointer transition duration-300 hover:opacity-80"
          onClick={() =>
            handleImageClick(previewCover || userData?.coverImage || defaultCover)
          }
        />
      </div>

      {/* PROFILE SECTION */}
      <div className="px-6 flex flex-col md:flex-row items-start md:items-center gap-4 -mt-14 relative">
        <div className="flex flex-col items-center">
          <div
            className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-900 cursor-pointer group relative"
            onClick={() =>
              handleImageClick(previewAvatar || userData?.avatar || defaultAvatar)
            }
          >
            <img
              className="w-full h-full object-cover"
              src={previewAvatar || userData?.avatar || defaultAvatar}
              alt="avatar"
            />
          </div>

          {/* CHANGE DP BUTTON */}
          <label className="mt-2 bg-gray-800/80 text-white text-sm px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-700 transition">
            Change DP
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "avatar")}
            />
          </label>
        </div>

        {/* USER INFO */}
        <div className="flex flex-col text-white">
          <h1 className="text-2xl font-bold mt-15">
            {userData?.fullname || "Full Name"}
          </h1>
          <span className="text-gray-400 text-sm">
            @{userData?.username || "username"} •{" "}
            {dashboardData ? dashboardData.totalSubscribers : 0} subscribers •{" "}
            {dashboardData ? dashboardData.totalVideos : 0} videos
            {userData?.username || "username"} •{" "}
            {dashboardData ? dashboardData.totalVideoViews : 0} Total Video Views •{" "}
            {dashboardData ? dashboardData.totalLikes : 0} Total Video Likes •{" "}
            {dashboardData ? dashboardData.totalTweet : 0} Total Tweet •{" "}
          </span>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            {userData?.bio || "This channel is about tech and small tips ..."}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-3">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Customize channel
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Manage videos
            </button>

            {/* ✅ NEW CHANGE COVER BUTTON */}
            <button
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer"
              onClick={() => document.getElementById("coverFileInput").click()}
            >
              Change Cover
            </button>
            <input
              id="coverFileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "cover")}
            />

            {(previewAvatar || previewCover) && (
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 border-b border-gray-700 px-6">
        <div className="flex gap-6 text-gray-400 text-sm font-medium">
          <button className="pb-3 border-b-2 border-white text-white">
            Home
          </button>
          <button className="pb-3 hover:text-white">Videos</button>
          <button className="pb-3 hover:text-white">Playlists</button>
          <button className="pb-3 hover:text-white">Posts</button>
        </div>
      </div>

      <div className="px-6 py-6">
        <p className="text-gray-400">Your Videos</p>
        <VideoCard data={videos ? videos : ""}/>
      </div>

      {/* ENLARGED IMAGE VIEWER */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 transition"
          onClick={closeEnlarged}
        >
          <div className="relative max-w-3xl w-[90%]">
            <img
              src={enlargedImage}
              alt="enlarged"
              className="rounded-2xl shadow-2xl object-contain max-h-[90vh] mx-auto"
            />
            <button
              className="absolute top-3 right-3 text-white text-2xl bg-black/50 hover:bg-black/70 rounded-full px-2 transition"
              onClick={closeEnlarged}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
