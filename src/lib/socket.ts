import { io } from "socket.io-client";

export const socket = io(process.env.CHAT_SERVER_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

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
