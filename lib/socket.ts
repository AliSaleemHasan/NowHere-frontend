// socket.ts
import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://192.168.1.69:3000", {
  transports: ["websocket"],
  autoConnect: true,
});
