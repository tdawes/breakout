import { Logger } from "./logging";
import { Mesh } from "./mesh";
import { PubSub, getStageSpaceId, getSpaceId } from "./pub-sub";

export interface RoomController {
  joinRoom: (roomId: string, userId: string) => void;
  joinRoomStage: (roomId: string, userId: string) => void;
  joinTable: (roomId: string, tableId: string, userId: string) => void;
  leaveRoom: (roomId: string, userId: string) => void;
  leaveRoomStage: (roomId: string, userId: string) => void;
  leaveTable: (roomId: string, tableId: string, userId: string) => void;
  unregister: (userId: string) => void;
}

export interface Table {
  id: string;
  members: string[];
}

export interface Room {
  id: string;
  stage: string[];
  tables: { [key: string]: Table };
}

export default (logger: Logger, pubSub: PubSub, mesh: Mesh): RoomController => {
  return {
    joinRoom: (roomId: string, userId: string) => {
      const spaceId = getStageSpaceId(roomId);
      const subscription = mesh.createSubscription(userId);
      pubSub.subscribe(spaceId, userId, subscription);
    },
    joinRoomStage: (roomId: string, userId: string) => {
      const spaceId = getStageSpaceId(roomId);
      pubSub.joinSpace(spaceId, userId);
    },
    joinTable: (roomId: string, tableId: string, userId: string) => {
      const spaceId = getSpaceId(roomId, tableId);
      pubSub.joinSpace(spaceId, userId);

      const subscription = mesh.createSubscription(userId);
      pubSub.subscribe(spaceId, userId, subscription);
    },
    leaveRoom: (roomId: string, userId: string) => {
      const spaceId = getStageSpaceId(roomId);
      pubSub.unsubscribe(spaceId, userId);
    },
    leaveRoomStage: (roomId: string, userId: string) => {
      const spaceId = getStageSpaceId(roomId);
      pubSub.leaveSpace(spaceId, userId);
    },
    leaveTable: (roomId: string, tableId: string, userId: string) => {
      const spaceId = getSpaceId(roomId, tableId);
      pubSub.unsubscribe(spaceId, userId);
      pubSub.leaveSpace(spaceId, userId);
    },
    unregister: (userId: string) => {
      pubSub.unsubscribeAll(userId);
      mesh.unregister(userId);
    },
  };
};
