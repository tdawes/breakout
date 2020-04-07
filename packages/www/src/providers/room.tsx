import * as React from "react";
import { Keyed, User, Room } from "../types";

export interface RoomState {
  room: Room | null;
  loading: boolean;
  changeRoom: (roomId: string) => void;
  changeName: (name: string) => void;
}

const RoomContext = React.createContext<RoomState>({} as RoomState);

export const useRoom = () => React.useContext(RoomContext);

const dummyRoom: Room = {
  id: "",
  name: "Room Name",
  users: {},
  tables: {
    a: { id: "a", name: "Table A", users: {} },
    b: { id: "b", name: "Table b", users: {} },
  },
  quizMaster: null,
};

export const RoomProvider: React.FC = (props) => {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [loading, setLoading] = React.useState(true);

  const changeRoom = (roomId: string) =>
    setRoom({
      ...dummyRoom,
      id: roomId,
    });

  const changeName = (name: string) => {
    if (room != null) {
      setRoom({
        ...room,
        name,
      });
    }
  };

  const value: RoomState = {
    room,
    loading,
    changeRoom,
    changeName,
  };

  return (
    <RoomContext.Provider value={value}>{props.children}</RoomContext.Provider>
  );
};
