import * as socket from "socket.io";
import { Logger } from "./logging";
import { Mesh } from "./mesh";
import { RoomController } from "./rooms";
import { SignallingController } from "./signalling";
import { WebRTCController } from "./webrtc";
import { PubSub } from "./pub-sub";

export default (
  io: socket.Server,
  mesh: Mesh,
  roomController: RoomController,
  pubSub: PubSub,
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

    socket.on("join room", ({ roomId }: { roomId: string }) => {
      logger.log("socket - join room", roomId, userId);
      roomController.joinRoom(roomId, userId);
    });
    socket.on("join room stage", ({ roomId }: { roomId: string }) => {
      logger.log("socket - join room stage", roomId, userId);
      roomController.joinRoomStage(roomId, userId);
    });
    socket.on(
      "join table",
      ({ roomId, tableId }: { roomId: string; tableId: string }) => {
        logger.log("socket - join table", roomId, tableId, userId);
        roomController.joinTable(roomId, tableId, userId);
      },
    );
    socket.on("leave room", ({ roomId }: { roomId: string }) => {
      logger.log("socket - leave room", roomId, userId);
      roomController.leaveRoom(roomId, userId);
    });
    socket.on("leave room stage", ({ roomId }: { roomId: string }) => {
      logger.log("socket - leave room stage", roomId, userId);
      roomController.leaveRoomStage(roomId, userId);
    });
    socket.on(
      "leave table",
      ({ roomId, tableId }: { roomId: string; tableId: string }) => {
        logger.log("socket - leave table", roomId, tableId, userId);
        roomController.leaveTable(roomId, tableId, userId);
      },
    );

    // Handle termination
    socket.on("disconnect", () => {
      logger.log("socket - disconnect");
      roomController.unregister(userId);
      closeConnection();
    });
  });
};
