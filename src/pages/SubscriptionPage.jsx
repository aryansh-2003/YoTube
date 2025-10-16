// src/pages/YouPage.jsx
import React, { useRef } from "react";

const sections = [
  {
    title: "History",
    videos: Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `History Video ${i + 1}`,
      channel: "Sample Channel",
      views: `${Math.floor(Math.random() * 500)}K views`,
      time: `${Math.floor(Math.random() * 12)} months ago`,
      thumbnail: `https://picsum.photos/seed/history${i}/400/225`,
    })),
  },
  {
    title: "Playlists",
    videos: Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `Playlist ${i + 1}`,
      channel: "Creator ${i + 1}",
      views: `${Math.floor(Math.random() * 500)}K views`,
      time: `${Math.floor(Math.random() * 12)} months ago`,
      thumbnail: `https://picsum.photos/seed/playlist${i}/400/225`,
    })),
  },
  {
    title: "Watch Later",
    videos: Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `Watch Later ${i + 1}`,
      channel: "Some Channel",
      views: `${Math.floor(Math.random() * 500)}K views`,
      time: `${Math.floor(Math.random() * 12)} months ago`,
      thumbnail: `https://picsum.photos/seed/watchlater${i}/400/225`,
    })),
  },
];

export default function SubscriptionPage() {
  return (
    <div className="bg-black text-white w-full h-screen overflow-y-auto no-scrollbar p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Sanjeev Dixit</h1>
        <p className="text-gray-400">@aryanshdixit5512 • View channel</p>
        <div className="mt-3 flex gap-3">
          <button className="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1 rounded-lg">
            Switch account
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1 rounded-lg">
            Google Account
          </button>
        </div>
      </div>

      {sections.map((section, idx) => (
        <Section key={idx} section={section} />
      ))}
    </div>
  );
}

function Section({ section }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-8">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold">{section.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Section */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-scroll no-scrollbar scroll-smooth"
      >
        {section.videos.map((vid) => (
          <div
            key={vid.id}
            className="min-w-[280px] bg-gray-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform"
          >
            <img
              src={vid.thumbnail}
              alt={vid.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-base truncate">{vid.title}</h3>
              <p className="text-sm text-gray-400">{vid.channel}</p>
              <p className="text-xs text-gray-500">
                {vid.views} • {vid.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
