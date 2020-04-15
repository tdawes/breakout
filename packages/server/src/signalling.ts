import * as Socket from "socket.io";
import {
  RTCIceCandidateInit,
  RTCPeerConnection,
  RTCSessionDescriptionInit,
} from "wrtc";
import { Logger } from "./logging";

export interface SignallingController {
  setupSignalling: (
    socket: Socket.Socket,
    connection: RTCPeerConnection,
  ) => void;
}

export default (logger: Logger): SignallingController => ({
  setupSignalling: (socket: Socket.Socket, connection: RTCPeerConnection) => {
    const sendOffer = async (initial: boolean) => {
      logger.log("signalling - sending sdp offer");
      const options = initial
        ? { offerToReceiveAudio: true, offerToReceiveVideo: true }
        : {};
      const offer = await connection.createOffer(options);
      await connection.setLocalDescription(offer);
      socket.emit("sdp offer", {
        offer: connection.localDescription,
      });
    };

    let initial = true;
    sendOffer(initial);
    connection.addEventListener("negotiationneeded", async () => {
      logger.log("signalling - negotiation needed");
      initial = false;
      await sendOffer(initial);
    });

    // Process the answer
    socket.on(
      "sdp answer",
      async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        logger.log("signalling - received sdp answer");
        await connection.setRemoteDescription(answer);
      },
    );

    // Process renegotiations
    socket.on(
      "sdp offer",
      async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
        await connection.setRemoteDescription(offer);
        const answer = await connection.createAnswer(
          initial
            ? { offerToReceiveAudio: true, offerToReceiveVideo: true }
            : {},
        );
        await connection.setLocalDescription(answer);
        socket.emit("sdp answer", {
          answer: connection.localDescription,
        });
      },
    );

    // Exchange ICE candidates
    connection.addEventListener("icecandidate", (e) => {
      logger.log("signalling - sending ice candidate");
      if (e.candidate) {
        socket.emit("ice candidate", {
          candidate: e.candidate,
        });
      }
    });
    socket.on(
      "ice candidate",
      async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        logger.log("signalling - received ice candidate");
        await connection.addIceCandidate(candidate);
      },
    );
  },
});
