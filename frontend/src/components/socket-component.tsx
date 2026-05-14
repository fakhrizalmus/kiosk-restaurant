"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";

export default function SocketComponent() {
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      console.log("Socket connected to server");
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected from server");
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  return null;
}
