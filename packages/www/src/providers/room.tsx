import * as React from "react";
import useData from "../hooks/use-data";
import { Room } from "../types";
import * as db from "../db";

export interface RoomState {
  room: Room | null;
  loading: boolean;
  changeRoom: (roomId: string) => void;
  setQuizMaster: (userId: string) => void;
}

const RoomContext = React.createContext<RoomState>({} as RoomState);

export const useRoom = () => React.useContext(RoomContext);

export const RoomProvider: React.FC = (props) => {
  const [roomId, setRoomId] = React.useState<string | undefined>(undefined);
  const { room, loading } = useData(roomId);

  const changeRoom = (roomId: string) => setRoomId(roomId);

  const setQuizMaster = (userId: string) => {
    if (room != null) {
      db.setRoom(room.id, {
        name: room.name,
        quizMaster: userId,
      });
    }
  };

  const value: RoomState = {
    room,
    loading,
    changeRoom,
    setQuizMaster,
  };

  return (
    <RoomContext.Provider value={value}>{props.children}</RoomContext.Provider>
  );
};
