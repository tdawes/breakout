import * as React from "react";
import { roomsCollection, tablesCollection, usersCollection } from "../db";
import {
  DBRoom,
  DBTable,
  Room,
  Table,
  Keyed,
  User,
  DBUser,
  LoadedState,
} from "../types";
import useAsyncEffect from "use-async-effect";

const createRoom = (
  roomId: string,
  dbRoom: DBRoom,
  dbTables: Keyed<DBTable>,
  dbRoomUsers: Keyed<DBUser>,
): Room | null => {
  const tables: Keyed<Table> = {};
  for (const [tableId, dbTable] of Object.entries(dbTables)) {
    tables[tableId] = {
      id: tableId,
      name: dbTable.name,
      users: {},
      roomId,
    };
  }

  const roomUsers: Keyed<User> = {};

  for (const [userId, dbUser] of Object.entries(dbRoomUsers)) {
    const user: User = {
      id: userId,
      ...dbUser,
    };

    roomUsers[userId] = user;

    if (user.tableId != null && tables[user.tableId] != null) {
      tables[user.tableId].users[user.id] = user;
    }
  }

  const room: Room = {
    id: roomId,
    name: dbRoom.name,
    quizMaster: dbRoom.quizMaster ?? null,
    tables,
    users: roomUsers,
  };

  return room;
};

const dbKeyBy = <T>(snapshot: firebase.firestore.QuerySnapshot): Keyed<T> => {
  const obj: Keyed<T> = {};
  for (const doc of snapshot.docs) {
    obj[doc.id] = doc.data() as T;
  }
  return obj;
};

const useData = (roomId: string | null) => {
  const [error, setError] = React.useState<string | null>(null);
  const [dbRoom, setDBRoom] = React.useState<DBRoom | null>(null);
  const [dbTables, setDBTables] = React.useState<Keyed<DBTable>>({});
  const [dbRoomUsers, setDBRoomUsers] = React.useState<Keyed<DBUser>>({});
  const [roomLoading, setRoomLoading] = React.useState(true);
  const [tablesLoading, setTablesLoading] = React.useState(true);
  const [usersLoading, setUsersLoading] = React.useState(true);
  const [loadedState, setLoadedState] = React.useState<LoadedState>(
    LoadedState.NOT_LOADED,
  );

  // reset state when roomId is set to null
  React.useEffect(() => {
    if (roomId == null) {
      setError(null);
      setDBRoom(null);
      setDBTables({});
      setDBRoomUsers({});
      setRoomLoading(true);
      setTablesLoading(true);
      setUsersLoading(true);
      setLoadedState(LoadedState.NOT_LOADED);
    }
  }, [roomId]);

  // check if room exists
  useAsyncEffect(async () => {
    if (roomId == null) {
      return null;
    }

    const roomRef = await roomsCollection.doc(roomId).get();
    if (!roomRef.exists) {
      setError("Room does not exist");
    } else {
      setError(null);
    }
  }, [roomId]);

  // subscription for room
  React.useEffect(() => {
    if (roomId == null) {
      return;
    }

    setRoomLoading(true);
    const unsubscribe = roomsCollection.doc(roomId).onSnapshot((snapshot) => {
      const data = snapshot.data() as DBRoom;
      setDBRoom(data);
      setRoomLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  // subscription for tables
  React.useEffect(() => {
    if (roomId == null) {
      return;
    }

    setTablesLoading(true);
    const unsubscribe = tablesCollection
      .where("roomId", "==", roomId)
      .onSnapshot((snapshot) => {
        setDBTables(dbKeyBy<DBTable>(snapshot));
        setTablesLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  // subscription for users
  React.useEffect(() => {
    if (roomId == null) {
      setDBRoomUsers({});
      return;
    }

    setUsersLoading(true);
    const unsubscribe = usersCollection
      .where("roomId", "==", roomId)
      .onSnapshot((snapshot) => {
        setDBRoomUsers(dbKeyBy<DBUser>(snapshot));
        setUsersLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const room: Room | null = React.useMemo(() => {
    if (dbRoom == null || roomId == null) {
      return null;
    }

    return createRoom(roomId, dbRoom, dbTables, dbRoomUsers);
  }, [roomId, dbRoom, dbTables, dbRoomUsers]);

  React.useEffect(() => {
    if (roomLoading || tablesLoading || usersLoading) {
      setLoadedState(LoadedState.LOADING);
    } else if (error != null) {
      setLoadedState(LoadedState.ERROR);
    } else {
      setLoadedState(LoadedState.LOADED);
    }
  }, [roomId, roomLoading, tablesLoading, usersLoading, error]);

  return {
    room,
    error,
    loading:
      loadedState === LoadedState.NOT_LOADED ||
      loadedState === LoadedState.LOADING,
    setLoadedState,
  };
};

export default useData;
