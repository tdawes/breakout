import * as React from "react";
import useData from "../hooks/use-data";
import { Room } from "../types";

export interface RoomState {
  room: Room | null;
  changeRoom: (roomId: string) => void;
}

const RoomContext = React.createContext<RoomState>({} as RoomState);

export const useRoom = () => React.useContext(RoomContext);

export const RoomProvider: React.FC = (props) => {
  const [roomId, setRoomId] = React.useState<string | undefined>(undefined);
  const room = useData(roomId);

  const changeRoom = (roomId: string) => setRoomId(roomId);

  const value: RoomState = {
    room,
    changeRoom,
  };

  return (
    <RoomContext.Provider value={value}>{props.children}</RoomContext.Provider>
  );
};
