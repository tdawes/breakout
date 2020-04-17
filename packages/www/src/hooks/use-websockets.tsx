/* eslint no-console: 0 */

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
      let s: SocketIOClient.Socket | null = null;

      const connectSocket = () => {
        console.log("reconnecting socket", { userId });

        const socket = io.connect(wsUrl, { query: { user: userId } });
        setSocket(socket);

        s = socket;

        socket.on("connect", () => {
          setConnected(true);
        });

        socket.on("disconnect", () => {
          console.log("socket disconnected!");
          setSocket(null);
          setConnected(false);

          // attempt to reconnect
          connectSocket();
        });

        socket.on("error", (...args) => {
          console.log(...args);
        });

        return socket;
      };

      connectSocket();

      return () => {
        console.log("closing socket! unsubscribing!", userId);
        s?.close();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [userId]);

  return { socket, connected };
};

export default useWebSockets;
