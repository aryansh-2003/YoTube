import React, { useContext } from "react";
import { useSelector } from "react-redux";
import DisplayPic from "../components/DisplayPic";
import HeaderContext from "../components/context/HeaderContext";

export default function ChannelDashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const { sidebarOpen } = useContext(HeaderContext);

  return (
    <main
      className={`bg-gray-900 min-h-screen pt-14`}
    >
      {/* Cover Image */}
      <div className="w-[98%] rounded-2xl h-48 bg-gray-800">
        {/* Replace with cover from userData later */}
        {userData?.coverImage ? (
          <img
            src={userData.coverImage}
            alt="cover"
            className="w-50 h-50 rounded-3xl object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-3xl bg-gray-800" />
        )}
      </div>

      {/* Avatar + Info */}
      <div className="px-6 flex flex-col md:flex-row items-start md:items-center gap-4 -mt-14">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-900">
          <DisplayPic children={userData} />
        </div>

        {/* Channel Info */}
        <div className="flex flex-col text-white">
          <h1 className="text-2xl font-bold">
            {userData?.fullName || "Channel Name"}
          </h1>
          <span className="text-gray-400 text-sm">
            @{userData?.username || "username"} •{" "}
            {userData?.subscribers?.length || 0} subscribers •{" "}
            {userData?.videos?.length || 0} videos
          </span>
          <p className="text-gray-300 text-sm mt-1 max-w-xl">
            {userData?.bio || "This channel is about tech and small tips ..."}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-3">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Customize channel
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
              Manage videos
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Content Section */}
      <div className="px-6 py-6">
        <p className="text-gray-400">For You (recommended videos)</p>
      </div>
    </main>
  );
}
