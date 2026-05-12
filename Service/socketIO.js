import { io } from "socket.io-client";

const socket = io("http://localhost:8000/", {
  reconnection: true,
  forceNew: true,
});

export default socket;
