import * as React from "react";
import * as io from "socket.io-client";

const wsUrl =
  process.env.NODE_ENV === "production"
    ? "NO PROD URL YET"
    : "http://localhost:4000";

const useWebSockets = (roomId: string) => {
  const socketRef = React.useRef<SocketIOClient.Socket | null>(null);
  const [connected, setConnected] = React.useState(false);
  const [inRoom, setInRoom] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<string[]>([]);

  const onConnect = () => {
    console.log("ws connected");
    socketRef.current?.emit("join", { roomId });
    setInRoom(roomId);
    setConnected(true);
  };

  const onDisconnect = () => {
    console.log("ws disconnected");
    setConnected(false);
  };

  const onMessage = ({ text }: { text: string }) => {
    setMessages([text, ...messages]);
  };

  const sendMessage = (text: string) => {
    socketRef.current?.emit("message", { text, roomId });
    setMessages([text, ...messages]);
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (socketRef.current == null) {
        const socket = io.connect(wsUrl);
        socketRef.current = socket;
      }

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, []);

  React.useEffect(() => {
    const socket = socketRef.current;

    if (socket == null) {
      return null;
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    };
  }, [messages]);

  return {
    connected,
    inRoom,
    messages,
    sendMessage,
  };
};

export default useWebSockets;
