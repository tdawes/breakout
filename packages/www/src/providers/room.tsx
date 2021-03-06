import * as React from "react";
import { useImmer } from "use-immer";
import * as db from "../db";
import useData from "../hooks/use-data";
import { LoadingValue, Room, Table, User } from "../types";
import { loadingValue, dataValue, errorValue } from "../utils";
import useCurrentUserData from "../hooks/use-current-user-data";
import useWebSockets from "../hooks/use-websockets";
import useWebRTC from "../hooks/use-webrtc";

export type RoomState = {
  currentRoom: LoadingValue<Room>;
  currentTable: LoadingValue<Table>;
  currentUser: LoadingValue<User | null>;
  preferredName: string;
  roomId: string | null;
  localStream: MediaStream | null;
  changeRoom: (roomId: string | null) => void;
  changeTable: (tableId: string | null) => void;
  createUser: (name: string, roomId: string, tableId?: string) => void;
  setQuizMaster: (userId: string) => void;
  setAllScratchpads: (contents: string) => void;
  setScratchpadsEditable: (value: boolean) => void;
  setScratchpad: (contents: string) => void;
  setName: (name: string) => void;
  setTable: (tableId: string | null) => void;
  setStage: (onStage: boolean) => void;
  getUserTracks: (userId: string) => MediaStreamTrack[];
};

const RoomContext = React.createContext<RoomState>({} as RoomState);

const useRoomData = (roomId: string | null): LoadingValue<Room> => {
  const [rooms, updateRooms] = useImmer<{
    [roomId: string]: LoadingValue<Room>;
  }>({});
  const result = useData(roomId);

  React.useEffect(() => {
    updateRooms((rooms) => {
      if (result.roomId != null) {
        rooms[result.roomId] = result;
      }
    });
  }, [result]);

  // current room we are in. default to loading state
  const room: LoadingValue<Room> = React.useMemo(
    () =>
      roomId == null || rooms[roomId] == null ? loadingValue() : rooms[roomId],
    [roomId, rooms],
  );

  return room;
};

const useTableData = (
  room: LoadingValue<Room>,
  tableId: string | null,
): LoadingValue<Table> => {
  const [table, setTable] = React.useState<LoadingValue<Table>>(loadingValue());

  React.useEffect(() => {
    if (room.data == null || tableId == null) {
      setTable(loadingValue());
      return;
    }

    if (room.data.tables[tableId] != null) {
      setTable(dataValue(room.data.tables[tableId]));
    } else {
      setTable(errorValue("Table not found"));
    }
  }, [tableId, room]);

  return table;
};

const useWSRoom = (
  socket: SocketIOClient.Socket | null,
  socketConnected: boolean,
  roomId: string | null,
  tableId: string | null,
  user: LoadingValue<User | null>,
) => {
  React.useEffect(() => {
    if (socket != null && socketConnected && roomId != null) {
      socket.emit("join room", { roomId });
      return () => {
        socket.emit("leave room", { roomId });
      };
    }
  }, [roomId, socket, socketConnected]);

  React.useEffect(() => {
    if (
      socket != null &&
      socketConnected &&
      roomId != null &&
      tableId != null
    ) {
      socket.emit("join table", { roomId, tableId });
      return () => {
        socket.emit("leave table", { roomId, tableId });
      };
    }
  }, [roomId, tableId, socket, socketConnected]);

  React.useEffect(() => {
    if (
      socket != null &&
      socketConnected &&
      roomId != null &&
      user.data?.onStage
    ) {
      socket.emit("join room stage", { roomId });
      return () => {
        socket.emit("leave room stage", { roomId });
      };
    }
  }, [roomId, user.data?.onStage, socket, socketConnected]);
};

export const RoomProvider: React.FC = (props) => {
  const [roomId, setRoomId] = React.useState<string | null>(null);
  const room = useRoomData(roomId);

  const [tableId, setTableId] = React.useState<string | null>(null);
  const table = useTableData(room, tableId);

  const {
    user,
    preferredName,
    setName,
    createUser,
    setStage,
    setTable,
  } = useCurrentUserData(room.data, tableId);

  const { socket, connected: socketConnected } = useWebSockets(
    user?.data?.id ?? null,
    roomId,
  );

  useWSRoom(socket, socketConnected, roomId, tableId, user);
  const { getUserTracks, localStream } = useWebRTC(socket);

  const changeRoom = React.useCallback(
    (newRoomId: string | null) => setRoomId(newRoomId),
    [roomId],
  );

  const changeTable = React.useCallback(
    (newTableId: string | null) => setTableId(newTableId),
    [tableId],
  );

  const setQuizMaster = React.useCallback(
    (userId: string) => {
      if (roomId != null) {
        db.updateRoom(roomId, { quizMaster: userId });
      }
    },
    [roomId],
  );

  const setScratchpad = React.useCallback(
    (contents: string) => {
      if (tableId != null) {
        db.updateTable(tableId, { scratchpad: contents });
      }
    },
    [tableId],
  );

  const setAllScratchpads = (contents: string) => {
    if (room.data != null) {
      Object.values(room.data.tables).map((table) => {
        db.updateTable(table.id, {
          scratchpad: contents,
        });
      });
    }
  };

  const setScratchpadsEditable = (value: boolean) => {
    if (room.data != null) {
      db.updateRoom(room.data.id, {
        scratchpadsEditable: value,
      });
    }
  };

  const value: RoomState = {
    currentRoom: room,
    currentTable: table,
    currentUser: user,
    localStream,
    preferredName,
    roomId,
    changeRoom,
    changeTable,
    setName,
    setQuizMaster,
    setAllScratchpads,
    setScratchpadsEditable,
    setScratchpad,
    setStage,
    setTable,
    createUser,
    getUserTracks,
  };

  return (
    <RoomContext.Provider value={value}>{props.children}</RoomContext.Provider>
  );
};

export const useRoom = () => React.useContext(RoomContext);

/*
 const stream = useVideo(userId);
*/

export const useVideo = (userId: string): MediaStream | null => {
  const [mediaStream, setMediaStream] = React.useState<MediaStream | null>(
    null,
  );
  const {
    getUserTracks,
    currentUser: { data: user },
    localStream,
  } = useRoom();

  React.useEffect(() => {
    // requesting video for current user
    if (user != null && userId === user.id) {
      setMediaStream(localStream);
      return;
    }
  }, [localStream, user, userId]);

  React.useEffect(() => {
    if (user == null || userId !== user.id) {
      const tracks = getUserTracks(userId);

      if (tracks.length === 0) {
        setMediaStream(null);
        return;
      }

      const mediaStream = new MediaStream();

      tracks.forEach((t) => {
        mediaStream.addTrack(t);
      });

      setMediaStream(mediaStream);
    }
  }, [userId, getUserTracks, user]);

  return mediaStream;
};
