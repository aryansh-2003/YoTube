import React from "react";
import VideoCard from "./video/VideoCard";
import defaultAvatar from "../assets/download.jpeg";
import { MessageCircle, Heart, Repeat2 } from "lucide-react";

const mockTweets = [
  {
    id: 1,
    owner: { name: "John Doe", username: "john_doe", avatar: defaultAvatar },
    time: "2h",
    content: "New React video drops tomorrow! 🔥 Stay tuned! #ReactJS #WebDev",
  },
  {
    id: 2,
    owner: { name: "Sarah Lee", username: "sarah_lee", avatar: defaultAvatar },
    time: "5h",
    content: "Growth isn’t linear — but it’s worth it. 💪 #Motivation",
  },
  {
    id: 3,
    owner: { name: "TechWave", username: "techwave_official", avatar: defaultAvatar },
    time: "1d",
    content: "We just hit 10K subs! ❤️ Thanks everyone! #YouTubeCreator",
  },
];

const mockPlaylists = [
  {
    id: 1,
    title: "React Mastery",
    thumbnail:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    videosCount: 12,
  },
  {
    id: 2,
    title: "Frontend Dev Tips",
    thumbnail:
      "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=80",
    videosCount: 8,
  },
  {
    id: 3,
    title: "Tech Talks & Podcasts",
    thumbnail:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80",
    videosCount: 5,
  },
];

export default function HomeSection() {
  return (
    <div className="flex flex-col gap-14">
      {/* 🐦 TWEETS SECTION */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Latest Tweets
          </h2>
          <button className="text-sm text-purple-400 hover:text-purple-300 transition font-medium">
            View all →
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {mockTweets.slice(0, 5).map((tweet) => (
            <div
              key={tweet.id}
              className="group relative rounded-2xl p-5 bg-gradient-to-br from-zinc-900/70 via-zinc-950/60 to-black/70 backdrop-blur-md border border-zinc-800 hover:border-purple-600/40 transition-all duration-300 hover:-translate-y-[2px]"
            >
              <div className="flex items-start gap-3">
                <img
                  src={tweet.owner.avatar || defaultAvatar}
                  alt={tweet.owner.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700 group-hover:ring-purple-500 transition-all duration-300"
                />
                <div className="flex flex-col w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {tweet.owner.name}
                    </span>
                    <span className="text-gray-400 text-sm">
                      @{tweet.owner.username}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      • {tweet.time}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm sm:text-base mt-1 leading-relaxed">
                    {tweet.content}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between text-gray-500 text-sm mt-4 max-w-md">
                <button className="flex items-center gap-2 hover:text-blue-400 transition">
                  <MessageCircle size={18} />
                  <span>12</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-400 transition">
                  <Repeat2 size={18} />
                  <span>8</span>
                </button>
                <button className="flex items-center gap-2 hover:text-pink-500 transition">
                  <Heart size={18} />
                  <span>35</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🎥 VIDEOS SECTION */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
            Latest Videos
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 transition font-medium">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <VideoCard data={[]} /> {/* placeholder – your existing component handles video layout */}
        </div>
      </section>

      {/* 🎶 PLAYLIST SECTION */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Featured Playlists
          </h2>
          <button className="text-sm text-pink-400 hover:text-pink-300 transition font-medium">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPlaylists.slice(0, 6).map((playlist) => (
            <div
              key={playlist.id}
              className="relative group rounded-2xl overflow-hidden shadow-lg bg-zinc-900/60 border border-zinc-800 hover:border-pink-600/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-[2px]"
            >
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition"></div>
              <div className="absolute bottom-3 left-3">
                <h3 className="text-white font-semibold text-lg drop-shadow-md">
                  {playlist.title}
                </h3>
                <span className="text-gray-400 text-sm">
                  {playlist.videosCount} videos
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
