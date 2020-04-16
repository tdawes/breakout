import { Logger } from "./logging";
import { Subscription } from "./pub-sub";

export interface Mesh {
  createSubscription: (userId: string) => Subscription;
  register: (userId: string, connection: RTCPeerConnection) => void;
  unregister: (userId: string) => void;
}

export type DataMessage =
  | { type: "connect"; mid: string; uid: string; kind: string; label?: string }
  | { type: "disconnect"; uid: string };

export interface Connection {
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  messageQueue: Array<() => DataMessage | null>;
  outgoing: {
    [otherUser: string]: number;
  };
  isDataChannelOpen: boolean;
  isConnectionStable: boolean;
  transceivers: RTCRtpTransceiver[];
}

const flushDataChannelMessages = (connection: Connection) => {
  if (connection.isDataChannelOpen && connection.isConnectionStable) {
    const newQueue = connection.messageQueue.splice(
      0,
      connection.messageQueue.length,
    );
    for (const msg of newQueue) {
      const message = msg();
      if (message != null) {
        connection.dataChannel.send(JSON.stringify(message));
      } else {
        connection.messageQueue.push(msg);
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
    logger.log(`Adding a transceiver from ${from} to ${to}`);
    const toConnection = connections[to];

    if (toConnection == null) {
      return;
    }

    const outgoing = toConnection.connection.addTransceiver(
      transceiver.receiver.track,
    );

    toConnection.messageQueue.push(() =>
      outgoing.mid == null
        ? null
        : {
            type: "connect",
            mid: outgoing.mid,
            uid: from,
            kind: transceiver.receiver.track.kind,
            label: transceiver.receiver.track.label,
          },
    );
    flushDataChannelMessages(toConnection);
  };

  const disconnectTransceivers = (from: string, to: string) => {
    const toConnection = connections[to];
    logger.log(
      `Killing the link from ${from} to ${to} as no more active connections.`,
      toConnection,
    );

    if (toConnection == null) {
      return;
    }

    // toConnection.transceivers.forEach((transceiver) => {
    //   if (
    //     fromConnection.transceivers.some(
    //       (fromTransceiver) =>
    //         fromTransceiver.sender.track?.id === transceiver.receiver.track.id,
    //     )
    //   ) {
    //     transceiver.stop();
    //   }
    // });

    toConnection.messageQueue.push(() => ({
      type: "disconnect",
      uid: from,
    }));
    flushDataChannelMessages(toConnection);
  };

  const connect = (from: string, to: string) => {
    if (from === to) {
      return;
    }
    const fromConnection = connections[from];
    logger.log(
      `mesh - adding connection from ${from} to ${to}: ${
        fromConnection.outgoing[to] ?? 0
      } current connections`,
      JSON.stringify(fromConnection.outgoing),
    );

    if (
      fromConnection.outgoing[to] == null ||
      fromConnection.outgoing[to] === 0
    ) {
      fromConnection.transceivers.forEach((transceiver) => {
        connectTransceiver(from, to, transceiver);
      });
    }

    if (fromConnection.outgoing[to] == null) {
      fromConnection.outgoing[to] = 0;
    }
    fromConnection.outgoing[to] = fromConnection.outgoing[to] + 1;

    logger.log(
      `There are now ${fromConnection.outgoing[to]} connections from ${from} to ${to}.`,
    );
  };

  const disconnect = (from: string, to: string) => {
    if (from === to) {
      return;
    }
    logger.log(`mesh - removing connection from ${from} to ${to}`);
    const fromConnection = connections[from];

    if (fromConnection == null) {
      return;
    }

    if (fromConnection.outgoing[to] <= 0) {
      return;
    }

    fromConnection.outgoing[to]--;
    logger.log(
      `There are now ${fromConnection.outgoing[to]} connections from ${from} to ${to}.`,
    );

    if (fromConnection.outgoing[to] === 0) {
      disconnectTransceivers(from, to);
    }
  };

  return {
    createSubscription: (userId: string) => ({
      onSubscribe: (otherUsers: string[]) => {
        logger.log("onSubscribe", userId, otherUsers);
        otherUsers.forEach((otherUser) => connect(otherUser, userId));
      },
      onUnsubscribe: (otherUsers: string[]) => {
        logger.log("onUnsubscribe", userId, otherUsers);
        otherUsers.forEach((otherUser) => disconnect(otherUser, userId));
      },
      onUserJoin: (otherUser: string) => {
        logger.log("onUserJoin", userId, otherUser);
        connect(otherUser, userId);
      },
      onUserLeave: (otherUser: string) => {
        logger.log("onUserLeave", userId, otherUser);
        disconnect(otherUser, userId);
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
        outgoing: {},
        transceivers: [],
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
        userConnection.transceivers.push(e.transceiver);
        Object.keys(userConnection.outgoing)
          .filter((otherUser) => userConnection.outgoing[otherUser] > 0)
          .forEach((otherUser) =>
            connectTransceiver(userId, otherUser, e.transceiver),
          );
      });

      connection.addEventListener("connectionstatechange", () => {
        userConnection.isConnectionStable =
          connection.signalingState === "stable";
        flushDataChannelMessages(userConnection);
      });
    },
    unregister: (userId: string) => {
      logger.log("mesh - unregister");

      const userConnection = connections[userId];

      if (userConnection == null) {
        return;
      }

      Object.keys(userConnection.outgoing)
        .filter((other) => userConnection.outgoing[other] > 0)
        .forEach((other) => disconnectTransceivers(userId, other));

      delete connections[userId];
    },
  };
};
