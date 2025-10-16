export default function Tabs() {
  const tabs = ["Home", "Videos", "Shorts", "Releases", "Playlists", "Posts"];

  return (
    <div className="flex justify-start border-b border-gray-700 px-6 md:px-10 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          className="text-gray-400 font-medium py-3 px-4 hover:text-white transition-colors"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
