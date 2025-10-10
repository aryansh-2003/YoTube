import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const uploadDateOptions = ["Last hour", "Today", "This week", "This month", "This year"];
const typeOptions = ["Video", "Channel", "Playlist", "Movie"];
const durationOptions = ["Under 4 minutes", "4 - 20 minutes", "Over 20 minutes"];
const featureOptions = [
  "Live",
  "4K",
  "HD",
  "Subtitles/CC",
  "Creative Commons",
  "360°",
  "VR180",
  "3D",
  "HDR",
  "Location",
  "Purchased",
];
const sortOptions = ["Relevance", "Upload date", "View count", "Rating"];

export default function SearchFilters({ onFilter, onClose }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    if (onFilter) onFilter(data);
  };

  return (
    <div className="bg-neutral-900 text-white rounded-xl p-6 shadow-2xl w-[90vw] sm:w-[700px] relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm"
      >
        {/* Upload Date */}
        <div>
          <p className="font-semibold mb-2">UPLOAD DATE</p>
          {uploadDateOptions.map((opt) => (
            <label key={opt} className="block cursor-pointer">
              <input type="radio" value={opt} {...register("uploadDate")} className="mr-2" />
              {opt}
            </label>
          ))}
        </div>

        {/* Type */}
        <div>
          <p className="font-semibold mb-2">TYPE</p>
          {typeOptions.map((opt) => (
            <label key={opt} className="block cursor-pointer">
              <input type="radio" value={opt} {...register("type")} className="mr-2" />
              {opt}
            </label>
          ))}
        </div>

        {/* Duration */}
        <div>
          <p className="font-semibold mb-2">DURATION</p>
          {durationOptions.map((opt) => (
            <label key={opt} className="block cursor-pointer">
              <input type="radio" value={opt} {...register("duration")} className="mr-2" />
              {opt}
            </label>
          ))}
        </div>

        {/* Features */}
        <div>
          <p className="font-semibold mb-2">FEATURES</p>
          {featureOptions.map((opt) => (
            <label key={opt} className="block cursor-pointer">
              <input type="checkbox" value={opt} {...register("features")} className="mr-2" />
              {opt}
            </label>
          ))}
        </div>

        {/* Sort By */}
        <div>
          <p className="font-semibold mb-2">SORT BY</p>
          {sortOptions.map((opt) => (
            <label key={opt} className="block cursor-pointer">
              <input type="radio" value={opt} {...register("sortBy")} className="mr-2" />
              {opt}
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="col-span-2 sm:col-span-5 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Reset
          </button>
          <button type="submit" className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded">
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}
