import { RTCPeerConnection } from "wrtc";
import { Logger } from "./logging";

export interface WebRTCController {
  newConnection: () => {
    connection: RTCPeerConnection;
    closeConnection: () => void;
  };
}

export default (logger: Logger) => ({
  newConnection: () => {
    const connection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    });
    logger.log("webrtc - connection");

    return {
      connection,
      closeConnection: () => {
        logger.log("webrtc - disconnect");
        connection.close();
      },
    };
  },
});
