import * as socket from "socket.io";
import { Logger } from "./logging";
import { Mesh } from "./mesh";
import { RoomController } from "./rooms";
import { SignallingController } from "./signalling";
import { WebRTCController } from "./webrtc";

export default (
  io: socket.Server,
  mesh: Mesh,
  roomController: RoomController,
  webRTC: WebRTCController,
  signalling: SignallingController,
  logger: Logger,
) => {
  io.on("connection", async (socket) => {
    logger.log("socket - connection");
    const userId = socket.handshake.query.user;

    const { connection, closeConnection } = webRTC.newConnection();
    mesh.register(userId, connection);

    signalling.setupSignalling(socket, connection);

    socket.on("join room", ({ room }: { room: string }) => {
      logger.log("socket - join room");
      roomController.joinRoom(room, userId);
    });
    socket.on("join room stage", ({ room }: { room: string }) => {
      logger.log("socket - join room stage");
      roomController.joinRoomStage(room, userId);
    });
    socket.on(
      "join table",
      ({ room, table }: { room: string; table: string }) => {
        logger.log("socket - join table");
        roomController.joinTable(room, table, userId);
      },
    );
    socket.on("leave room", ({ room }: { room: string }) => {
      logger.log("socket - leave room");
      roomController.leaveRoom(room, userId);
    });
    socket.on("leave room stage", ({ room }: { room: string }) => {
      logger.log("socket - leave room stage");
      roomController.leaveRoomStage(room, userId);
    });
    socket.on(
      "leave table",
      ({ room, table }: { room: string; table: string }) => {
        logger.log("socket - leave table");
        roomController.leaveTable(room, table, userId);
      },
    );

    // Handle termination
    socket.on("disconnect", () => {
      logger.log("socket - disconnect");
      mesh.unregister(userId);
      closeConnection();
    });
  });
};
