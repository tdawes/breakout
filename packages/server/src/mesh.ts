import {
  MediaStreamTrack,
  RTCPeerConnection,
  RTCRtpSender,
  RTCTrackEvent,
} from "wrtc";
import { Logger } from "./logging";
import { PubSub, Subscription } from "./pub-sub";

export interface Mesh {
  createSubscription: (userId: string) => Subscription;
  register: (userId: string, connection: RTCPeerConnection) => void;
  unregister: (userId: string) => void;
}

export default (logger: Logger): Mesh => {
  const connections: {
    [userId: string]: {
      connection: RTCPeerConnection;
      dataChannel: RTCDataChannel;
      links: string[];
      tranceivers: RTCRtpTransceiver[];
    };
  } = {};

  const connectTransceiver = (
    from: string,
    to: string,
    transceiver: RTCRtpTransceiver,
  ) => {
    const outgoing = connections[to].connection.addTransceiver(
      transceiver.receiver.track,
    );
    connections[to].dataChannel.send(
      JSON.stringify({
        mid: outgoing.mid,
        uid: from,
        kind: transceiver.receiver.track.kind,
        label: transceiver.receiver.track.label,
      }),
    );
  };

  const connect = (from: string, to: string) => {
    if (from === to) {
      return;
    }
    logger.log(`mesh - adding connection from ${from} to ${to}`);
    const fromConnection = connections[from];
    const toConnection = connections[to];
    fromConnection.links.push(to);

    fromConnection.tranceivers.forEach((transceiver) => {
      connectTransceiver(from, to, transceiver);
    });
  };

  const disconnect = (from: string, to: string) => {
    if (from === to) {
      return;
    }
    logger.log(`mesh - removing connection from ${from} to ${to}`);
    const fromConnection = connections[from];
    fromConnection.links.splice(fromConnection.links.indexOf(to), 1);
  };

  return {
    createSubscription: (userId: string) => ({
      onSubscribe: (otherUsers: string[]) => {
        otherUsers.forEach((otherUser) => connect(userId, otherUser));
      },
      onUnsubscribe: (otherUsers: string[]) => {
        otherUsers.forEach((otherUser) => disconnect(userId, otherUser));
      },
      onUserJoin: (otherUser: string) => {
        connect(userId, otherUser);
      },
      onUserLeave: (otherUser: string) => {
        disconnect(userId, otherUser);
      },
    }),
    register: (userId: string, connection: RTCPeerConnection) => {
      logger.log("mesh - register");

      const dataChannel = connection.createDataChannel("track-metadata");
      connections[userId] = {
        connection,
        dataChannel,
        links: [],
        tranceivers: [],
      };

      connection.addEventListener("track", (e: RTCTrackEvent) => {
        connections[userId].tranceivers.push(e.transceiver);
        connections[userId].links.forEach((otherUser) =>
          connectTransceiver(userId, otherUser, e.transceiver),
        );
      });
    },
    unregister: (userId: string) => {
      logger.log("mesh - unregister");
      connections[userId].links.forEach((other) => disconnect(userId, other));

      delete connections[userId];
    },
  };
};
