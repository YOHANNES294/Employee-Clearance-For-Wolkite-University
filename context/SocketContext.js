"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Create socket connection when component mounts
    const newSocket = io("ws://localhost:8900");
    // socket.current = io("ws://localhost:8900");

    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    // Check if the socket is not null before emitting events
    if (socket) {
      socket.emit("addUser", user?.id);
      socket.on("getUsers", (users) => {
        //  console.log(users);
      });
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
