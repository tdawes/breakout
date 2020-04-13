import * as React from "react";
import useData from "../hooks/use-data";
import { Room } from "../types";
import * as db from "../db";

export interface RoomState {
  room: Room | null;
  loading: boolean;
  error: string | null;
  changeRoom: (roomId: string | null) => void;
  setQuizMaster: (userId: string) => void;
}

const RoomContext = React.createContext<RoomState>({} as RoomState);

export const useRoom = () => React.useContext(RoomContext);

export const RoomProvider: React.FC = (props) => {
  const [roomId, setRoomId] = React.useState<string | null>(null);
  const { room, loading, error } = useData(roomId);

  const changeRoom = (roomId: string | null) => setRoomId(roomId);

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
    error,
    changeRoom,
    setQuizMaster,
  };

  return (
    <RoomContext.Provider value={value}>{props.children}</RoomContext.Provider>
  );
};
