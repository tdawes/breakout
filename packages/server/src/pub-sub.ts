import { MediaStreamTrack, RTCPeerConnection, RTCRtpSender } from "wrtc";
import { Logger } from "./logging";

export type Subscription = {
  onSubscribe?: (userIds: string[]) => void;
  onUnsubscribe?: (userIds: string[]) => void;
  onUserJoin?: (userId: string) => void;
  onUserLeave?: (userId: string) => void;
};

export type Unsubscribe = () => void;

export interface PubSub {
  joinSpace: (spaceId: string, userId: string) => void;
  leaveSpace: (spaceId: string, userId: string) => void;
  subscribe: (
    spaceId: string,
    userId: string,
    subscription: Subscription,
  ) => void;
  unsubscribe: (spaceId: string, userId: string) => void;
}

export const getSpaceId = (roomId: string, tableId: string) =>
  `${roomId}/${tableId}`;

export const getStageSpaceId = (roomId: string) => `${roomId}/stage`;

export default (logger: Logger) => {
  const spaces: {
    [spaceId: string]: {
      subscriptions: { [userId: string]: Subscription };
      users: Set<string>;
    };
  } = {};

  const joinSpace = (spaceId: string, userId: string) => {
    logger.log(`PubSub - User ${userId} joined space ${spaceId}.`);
    if (spaces[spaceId] == null) {
      spaces[spaceId] = { subscriptions: {}, users: new Set() };
    }

    spaces[spaceId].users.add(userId);

    Object.values(spaces[spaceId].subscriptions).forEach((subscription) => {
      if (subscription.onUserJoin != null) {
        subscription.onUserJoin(userId);
      }
    });
  };

  const leaveSpace = (spaceId: string, userId: string) => {
    logger.log(`PubSub - User ${userId} left space ${spaceId}.`);

    spaces[spaceId].users.delete(userId);
    Object.values(spaces[spaceId].subscriptions).forEach((subscription) => {
      if (subscription.onUserLeave != null) {
        subscription.onUserLeave(userId);
      }
    });
  };

  const subscribe = (
    spaceId: string,
    userId: string,
    subscription: Subscription,
  ): Unsubscribe => {
    if (spaces[spaceId] == null) {
      spaces[spaceId] = { subscriptions: {}, users: new Set() };
    }

    spaces[spaceId].subscriptions[userId] = subscription;

    if (subscription.onSubscribe) {
      subscription.onSubscribe(Array.from(spaces[spaceId].users));
    }

    return () => {
      unsubscribe(spaceId, userId);
    };
  };

  const unsubscribe = (spaceId: string, userId: string): void => {
    if (spaces[spaceId]?.subscriptions[userId] != null) {
      const subscription = spaces[spaceId].subscriptions[userId];
      delete spaces[spaceId].subscriptions[userId];
      if (subscription.onUnsubscribe) {
        subscription.onUnsubscribe(Array.from(spaces[spaceId].users));
      }
    }
  };

  return {
    joinSpace,
    leaveSpace,
    subscribe,
    unsubscribe,
  };
};
