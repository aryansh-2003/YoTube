import { mockVideos } from "../mockData/mockChannelData";

<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
  {mockVideos.map((video) => (
    <div key={video._id} className="flex flex-col gap-2">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="rounded-lg hover:scale-105 transition-transform duration-200"
      />
      <h3 className="font-semibold">{video.title}</h3>
      <p className="text-gray-400 text-sm">
        {video.views.toLocaleString()} views • {video.uploadedAt}
      </p>
      <p className="text-gray-500 text-xs line-clamp-2">{video.description}</p>
    </div>
  ))}
</div>;
