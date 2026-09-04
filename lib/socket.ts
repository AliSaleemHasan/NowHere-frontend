import { SNAPS_SOCKET_URL } from "@/utils";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let connectedToken: string | undefined;

export function getSnapSocket(): Socket | null {
  return socket;
}

export function connectSnapSocket(accessToken: string): Socket {
  if (!SNAPS_SOCKET_URL) {
    throw new Error("Missing EXPO_PUBLIC_SNAPS_SOCKET_URL");
  }

  if (socket && connectedToken === accessToken) {
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  socket = io(SNAPS_SOCKET_URL, {
    auth: { token: accessToken },
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1000,
  });
  connectedToken = accessToken;

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
}

export function disconnectSnapSocket(): void {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  connectedToken = undefined;
}
