// socket.ts
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(process.env.EXPO_PUBLIC_SNAPS_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
});
