import { Logger } from "./logging";
import { Subscription } from "./pub-sub";

export interface Mesh {
  createSubscription: (userId: string) => Subscription;
  register: (userId: string, connection: RTCPeerConnection) => void;
  unregister: (userId: string) => void;
}

export interface Connection {
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  messageQueue: Array<() => string>;
  isDataChannelOpen: boolean;
  isConnectionStable: boolean;
  links: string[];
  tranceivers: RTCRtpTransceiver[];
}

const flushDataChannelMessages = (connection: Connection) => {
  if (connection.isDataChannelOpen && connection.isConnectionStable) {
    while (connection.messageQueue.length > 0) {
      const msg = connection.messageQueue.shift();
      if (msg != null) {
        connection.dataChannel.send(msg());
      }
    }
  }
};

export default (logger: Logger): Mesh => {
  const connections: {
    [userId: string]: Connection;
  } = {};

  const connectTransceiver = (
    from: string,
    to: string,
    transceiver: RTCRtpTransceiver,
  ) => {
    const toConnection = connections[to];

    const outgoing = toConnection.connection.addTransceiver(
      transceiver.receiver.track,
    );

    toConnection.connection.addEventListener("connectionstatechange", () => {
      toConnection.isConnectionStable =
        toConnection.connection.signalingState === "stable";
      flushDataChannelMessages(toConnection);
    });

    logger.log("OUTGOING", outgoing);

    toConnection.messageQueue.push(() =>
      JSON.stringify({
        mid: outgoing.mid,
        uid: from,
        kind: transceiver.receiver.track.kind,
        label: transceiver.receiver.track.label,
      }),
    );
    flushDataChannelMessages(toConnection);
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

    if (fromConnection) {
      fromConnection.links.splice(fromConnection.links.indexOf(to), 1);
    }
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
      const userConnection: Connection = {
        connection,
        dataChannel,
        messageQueue: [],
        isDataChannelOpen: false,
        isConnectionStable: false,
        links: [],
        tranceivers: [],
      };
      connections[userId] = userConnection;

      dataChannel.addEventListener("open", () => {
        userConnection.isDataChannelOpen = true;
        flushDataChannelMessages(userConnection);
      });

      dataChannel.addEventListener("close", () => {
        userConnection.isDataChannelOpen = false;
      });

      connection.addEventListener("track", (e: RTCTrackEvent) => {
        userConnection.tranceivers.push(e.transceiver);
        userConnection.links.forEach((otherUser) =>
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
