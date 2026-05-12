import React, { useState } from "react";
import NotificationComponent from "../components/NotificationComponent"
import { useSelector } from "react-redux";
import notificationService from "../../Service/notification"
import { useEffect } from "react";
import { io } from "socket.io-client";
    // const socket = io("http://localhost:8000/", {
    //   withCredentials: true
    // });

export default function InstagramNotificationList() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "and 2,568 others liked your reel.",
      status: true, // "Like" style
    },
    {
      id: 2,
      message: "started following you.",
      status: false, // "Follow" style
    },
    {
      id: 3,
      message: "and 1,041 others liked your reel.",
      status: true,
    },
    {
      id: 4,
      message: "started following you.",
      status: false,
    },
    {
      id: 5,
      message: "started following you.",
      status: false,
    },
  ]);
    const Notifications = useSelector(state => state?.auth?.userData?.notification)

    useEffect(() => {
      notificationService.getNotification().then((res) => {
        console.log(res)
        setNotifications(res.data?.data?.notifications)

        //   socket.on("connect", () => {
        //   console.log("Connected to socket", socket.id);
        // });

        // socket.on("newNotification", (notif) => {
        //   console.log("📣 New notification:", notif);
        // });

      })
    },[setNotifications])







  console.log(Notifications)

  const handleClose = (id) => {
    // In a real app, this might delete the notif or follow the user
    console.log("Interaction on notification:", id);
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
 <div className="bg-black min-h-screen max-w-md mx-auto border-x border-gray-800 mt-10">
      {notifications && notifications.map((notification)=>{
        return(
          <>
            <NotificationComponent
            type={notification.notifyType}
            username={notification.clientInfo?.[0]?.fullname}
            time="2m"
            userAvatar={notification.clientInfo?.[0]?.avatar}
            postImage={notification.postInfo?.[0]?.thumbnail}
            postId={notification.postInfo?.[0]?._id}
            channelName={notification.clientInfo?.[0]?.username}
            onFollow={() => console.log("Followed back!")}
           />
          </>
        )
      })}
      {/* 1. FOLLOW NOTIFICATION */}
      <NotificationComponent
        type="follow"
        username="jessica_design"
        time="2m"
        userAvatar="https://i.pravatar.cc/150?img=5"
        onFollow={() => console.log("Followed back!")}
      />

      {/* 2. LIKE NOTIFICATION (Multiple users/Stacked) */}
      <NotificationComponent
        type="like"
        username="mike_photography"
        secondUser="sarah_art"
        time="15m"
        userAvatar="https://i.pravatar.cc/150?img=11"
        postImage="https://picsum.photos/id/1015/100/100"
      />

      {/* 3. COMMENT NOTIFICATION */}
      <NotificationComponent
        type="comment"
        username="alex_travels"
        message="This shot is absolutely stunning! 🔥"
        time="1h"
        userAvatar="https://i.pravatar.cc/150?img=33"
        postImage="https://picsum.photos/id/1016/100/100"
      />
      
    </div>
  );
}