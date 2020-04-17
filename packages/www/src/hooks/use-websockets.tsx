import * as React from "react";
import * as io from "socket.io-client";

const wsUrl =
  process.env.NODE_ENV === "production"
    ? "https://breakout-by-prodo.herokuapp.com"
    : "http://localhost:4000";

const useWebSockets = (userId: string | null, roomId: string | null) => {
  const [socket, setSocket] = React.useState<SocketIOClient.Socket | null>(
    null,
  );
  const [connected, setConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (userId != null) {
      const socket = io.connect(wsUrl, { query: { user: userId } });
      socket.on("connect", () => {
        setConnected(true);
      });

      socket.on("disconnect", () => {
        // eslint-disable-next-line
        console.log("socket disconnected!");
        setConnected(false);
      });

      socket.on("error", (...args) => {
        // eslint-disable-next-line
        console.log(...args);
      });

      setSocket(socket);

      return () => {
        // eslint-disable-next-line
        console.log("closing socket!");
        socket?.close();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [userId]);

  return { socket, connected };
};

export default useWebSockets;
