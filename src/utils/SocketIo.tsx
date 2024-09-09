import React, { createContext, useContext, ReactNode, useMemo } from "react";
import io, { Socket } from "socket.io-client";

type SocketContextType = {
  socket : Socket | null
}
const SocketContext = createContext<SocketContextType | null>(null);


const SocketProvider = ({ children }: {children: React.ReactNode}) => {
  const socket = useMemo(
    () =>
      io("https://chat-app-backend-z66y.onrender.com/", {
        auth: {
          token: localStorage.getItem("authtoken"),
        },
      }),
    []
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
