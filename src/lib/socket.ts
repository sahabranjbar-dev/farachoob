import { io, Socket } from "socket.io-client";

// مطمئن شو که ENV در فرانت‌اند با NEXT_PUBLIC_ شروع می‌شود
const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL!;
if (!CHAT_SERVER_URL) {
  throw new Error("❌ NEXT_PUBLIC_CHAT_SERVER_URL is not set!");
}

// اتصال Socket.IO
export const socket: Socket = io(CHAT_SERVER_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

// تابع emit ایمن
export const emitSocket = (event: string, data?: any) => {
  if (!socket.connected) {
    socket.connect();
    socket.once("connect", () => {
      socket.emit(event, data);
    });
  } else {
    socket.emit(event, data);
  }
};
