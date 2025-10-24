import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle, Heart, Repeat2, Share2, X, Plus } from "lucide-react";
import defaultAvatar from "../../src/assets/download.jpeg";
import tweetService from '../../Service/tweet';
import { useSelector } from "react-redux";

export default function TweetSection() {
  const [tweets, setTweets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector(state => state?.auth?.userData);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch user tweets on mount or user change
  useEffect(() => {
    if (!userData) return;
    tweetService.getUserTweets({ id: userData._id }).then(res => {
      if (res?.data?.data) setTweets(res.data.data);
    });
  }, [userData]);

  const onSubmit = async (data) => {
    const message = data.message?.trim();
    if (!message) return;

    // API call
    tweetService.createTweet({ message }).then(res => {
      console.log(res);
    });

    // Update state immediately
    const newTweet = {
      id: Date.now(),
      ownerInfo: [{ name: userData?.name || "You", fullname: userData?.username || "current_user", avatar: userData?.avatar || defaultAvatar }],
      createdAt: "Just now",
      content: message,
    };
    setTweets([newTweet, ...tweets]);
    reset();
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6 relative">

      {/* Create Tweet Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-md transition-all duration-300"
        >
          <Plus size={18} />
          Create Tweet
        </button>
      </div>

      {/* Tweet List */}
      {tweets.map(tweet => (
        <div
          key={tweet.id}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-start gap-3">
            <img
              src={tweet.ownerInfo?.[0]?.avatar || defaultAvatar}
              alt={tweet.ownerInfo?.[0]?.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-700"
            />
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white font-semibold text-sm sm:text-base">
                  {tweet.ownerInfo?.[0]?.name}
                </span>
                <span className="text-gray-400 text-sm">
                  @{tweet.ownerInfo?.[0]?.fullname}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  • {tweet.createdAt}
                </span>
              </div>
              <p className="text-gray-200 text-sm sm:text-base mt-1 leading-relaxed">
                {tweet.content}
              </p>
            </div>
          </div>

          {/* Tweet Image */}
          {tweet.image && (
            <div className="mt-3">
              <img
                src={tweet.image}
                alt="Tweet media"
                className="w-full rounded-xl object-cover max-h-[400px] transition hover:opacity-90"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between text-gray-400 text-sm mt-3 sm:mt-4 max-w-md">
            <button className="flex items-center gap-2 hover:text-blue-500 transition">
              <MessageCircle size={18} />
              <span>23</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 transition">
              <Repeat2 size={18} />
              <span>10</span>
            </button>
            <button className="flex items-center gap-2 hover:text-pink-500 transition">
              <Heart size={18} />
              <span>67</span>
            </button>
            <button className="flex items-center gap-2 hover:text-gray-300 transition">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {/* Create Tweet Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">
              Create New Tweet
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <textarea
                {...register("message", {
                  required: "Tweet message is required",
                  maxLength: {
                    value: 280,
                    message: "Tweet cannot exceed 280 characters",
                  },
                })}
                rows={4}
                placeholder="What's happening?"
                className="w-full bg-gray-800 text-gray-100 rounded-xl p-3 outline-none border border-gray-700 focus:border-blue-500 resize-none"
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-md transition-all duration-300"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
