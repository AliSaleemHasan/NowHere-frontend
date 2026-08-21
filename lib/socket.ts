// socket.ts
import { io, Socket } from "socket.io-client";
const socketUrl = process.env.EXPO_PUBLIC_SNAPS_URL || "";

export const socket: Socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
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
