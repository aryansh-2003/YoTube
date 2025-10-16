export default function ChannelCover({ coverImage }) {
  return (
    <div className="w-full h-56 md:h-72 bg-gray-900 rounded-b-2xl overflow-hidden">
      <img
        src={coverImage || "/default-cover.jpg"}
        alt="Cover"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
