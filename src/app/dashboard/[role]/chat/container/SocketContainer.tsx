"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext<{
  socket: any;
}>({
  socket: null,
});

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("use socket should between SocketContainer");
  } else return socket;
};

const SocketContainer = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io();

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContainer;
