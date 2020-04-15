import * as http from "http";
import socketIO from "socket.io";
import newLogger from "./logging";
import newMesh from "./mesh";
import newRoomController from "./rooms";
import newSignallingController from "./signalling";
import newPubSub from "./pub-sub";
import setupSockets from "./sockets";
import newWebRTCController from "./webrtc";

const server = http.createServer();
const io = socketIO(server);

const port = process.env.PORT || 4000;

const logger = newLogger();
const mesh = newMesh(logger);
const pubSub = newPubSub(logger);
const rooms = newRoomController(logger, pubSub, mesh);
const webRTC = newWebRTCController(logger);
const signalling = newSignallingController(logger);
setupSockets(io, mesh, rooms, webRTC, signalling, logger);

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Started server on port ${port}`);
});
