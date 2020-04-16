/* eslint no-console: 0 */

import * as React from "react";
import { User, Keyed, LoadingValue } from "../types";
import { useImmer } from "use-immer";

export enum SignallingMessage {
  SDP_OFFER = "sdp offer",
  SDP_ANSWER = "sdp answer",
  ICE_CANDIDATE = "ice candidate",
}

const webrtcConfig = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const useWebRTC = (socket: SocketIOClient.Socket | null) => {
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(
    null,
  );

  // userId -> mid
  const [midLookup, updateMidLookup] = useImmer<Keyed<string[]>>({});

  // mid -> track
  const [trackLookup, updateTrackLookup] = useImmer<Keyed<MediaStreamTrack>>(
    {},
  );

  const getUserTracks = React.useCallback(
    (userId: string | null): MediaStreamTrack[] => {
      if (userId == null) {
        return [];
      }

      const mids = midLookup[userId];

      if (mids == null) {
        return [];
      }

      const tracks = mids.map((mid) => trackLookup[mid]).filter(Boolean);

      return tracks;
    },
    [midLookup, trackLookup],
  );

  React.useEffect(() => {
    if (socket == null) {
      return;
    }

    const connection = new RTCPeerConnection(webrtcConfig);

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((ls) => {
        setLocalStream(ls);

        ls.getTracks().forEach((track) => {
          connection.addTrack(track, ls);
        });
      });

    connection.addEventListener("icecandidate", (e) => {
      console.log("sending ice candidate");
      if (e.candidate) {
        socket.emit(SignallingMessage.ICE_CANDIDATE, {
          candidate: e.candidate,
        });
      }
    });

    connection.addEventListener("negotiationneeded", async () => {
      console.log("negotiationneeded - making sdp offer");
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socket.emit(SignallingMessage.SDP_OFFER, {
        offer,
      });
    });

    connection.addEventListener("datachannel", async (event) => {
      if (event.channel != null) {
        event.channel.addEventListener("message", (event) => {
          try {
            const { mid, uid } = JSON.parse(event.data) as {
              mid: string;
              uid: string;
            };
            updateMidLookup((midLookup) => {
              if (midLookup[uid] == null) midLookup[uid] = [];
              midLookup[uid].push(mid);
            });
          } catch (e) {
            console.error("failed to decode datachannel message", event.data);
          }
          console.log("DATA CHANNEL MESSAGE", event);
        });
      }
    });

    socket.on(
      SignallingMessage.SDP_ANSWER,
      async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        console.log("sdp answer");
        await connection.setRemoteDescription(answer);
      },
    );

    socket.on("disconnect", () => {
      connection.close();
    });

    socket.on(
      SignallingMessage.SDP_OFFER,
      async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
        console.log("socket sdp offer");
        await connection.setRemoteDescription(offer);
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        socket.emit(SignallingMessage.SDP_ANSWER, {
          answer,
        });
      },
    );

    socket.on(
      SignallingMessage.ICE_CANDIDATE,
      async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        console.log("socket recevied sdp offer");
        await connection.addIceCandidate(candidate);
      },
    );

    connection.addEventListener("track", (e) => {
      console.log("received track");
      const remoteStream = new MediaStream();
      remoteStream.addTrack(e.track);

      updateTrackLookup((trackLookup) => {
        if (e.transceiver.mid != null) {
          trackLookup[e.transceiver.mid] = e.track;
        }
      });
    });

    return () => {
      connection.close();
    };
  }, [socket]);

  return { getUserTracks, localStream };
};

export default useWebRTC;
