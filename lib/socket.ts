// socket.ts
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(process.env.EXPO_PUBLIC_SNAPS_URL, {
  transports: ["websocket"],
  autoConnect: true,
});
