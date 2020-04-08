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

const dummyUsers = {
  u1: { id: "u1", name: "Alice" },
  u2: { id: "u2", name: "Bob" },
  u3: { id: "u3", name: "Eve" },
};

const dummyRoom: Room = {
  id: "",
  name: "Room Name",
  users: dummyUsers,
  tables: {
    a: { id: "a", name: "Table A", users: { u1: dummyUsers.u1 } },
    b: {
      id: "b",
      name: "Table b",
      users: { u2: dummyUsers.u2, u3: dummyUsers.u3 },
    },
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
