import * as React from "react";
import { useImmer } from "use-immer";
import * as db from "../db";
import useData from "../hooks/use-data";
import { LoadingValue, Room } from "../types";

export type RoomState = LoadingValue<Room> & {
  roomId: string | null;
  changeRoom: (roomId: string | null) => void;
  setQuizMaster: (userId: string) => void;
};

const RoomContext = React.createContext<RoomState>({} as RoomState);

export const useRoom = () => React.useContext(RoomContext);

export const RoomProvider: React.FC = (props) => {
  const [roomId, setRoomId] = React.useState<string | null>(null);
  const [rooms, updateRooms] = useImmer<{
    [roomId: string]: LoadingValue<Room>;
  }>({});
  const result = useData(roomId);

  // current room we are in. default to loading state
  const room: LoadingValue<Room> =
    roomId == null || result.roomId == null || rooms[roomId] == null
      ? {
          loading: true,
          error: null,
          data: null,
        }
      : rooms[roomId];

  React.useEffect(() => {
    console.log("RESULT", result);
    updateRooms((rooms) => {
      if (result.roomId != null) {
        rooms[result.roomId] = result;
      }
    });
  }, [result]);

  const changeRoom = (roomId: string | null) => setRoomId(roomId);

  const setQuizMaster = (userId: string) => {
    if (room.data != null) {
      db.setRoom(room.data.id, {
        name: room.data.name,
        quizMaster: userId,
      });
    }
  };

  const value: RoomState = {
    ...room,
    roomId,
    changeRoom,
    setQuizMaster,
  };

  return (
    <RoomContext.Provider value={value}>{props.children}</RoomContext.Provider>
  );
};
