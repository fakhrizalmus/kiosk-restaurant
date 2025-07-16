// components/SocketComponent.tsx
"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";

export default function SocketComponent() {
  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("✅ connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("❌ disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}