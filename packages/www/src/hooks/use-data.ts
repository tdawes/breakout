import * as React from "react";
import useAsyncEffect from "use-async-effect";
import { roomsCollection, tablesCollection, usersCollection } from "../db";
import {
  DBRoom,
  DBTable,
  DBUser,
  Keyed,
  LoadingValue,
  Room,
  Table,
  User,
} from "../types";
import { dataValue, errorValue, loadingValue } from "../utils";

const createRoom = (
  roomId: string,
  dbRoom: DBRoom,
  dbTables: Keyed<DBTable>,
  dbRoomUsers: Keyed<DBUser>,
): Room => {
  const tables: Keyed<Table> = {};
  for (const [tableId, dbTable] of Object.entries(dbTables)) {
    tables[tableId] = {
      id: tableId,
      name: dbTable.name,
      users: {},
      roomId,
      scratchpad: dbTable.scratchpad ?? "",
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
    scratchpadsEditable: dbRoom.scratchpadsEditable ?? true,
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

type Result = LoadingValue<Room> & {
  roomId: string | null;
};

const useData = (roomId: string | null): Result => {
  const [error, setError] = React.useState<string | null>(null);
  const [dbRoom, setDBRoom] = React.useState<DBRoom | null>(null);
  const [dbTables, setDBTables] = React.useState<Keyed<DBTable>>({});
  const [dbRoomUsers, setDBRoomUsers] = React.useState<Keyed<DBUser>>({});
  const [roomLoading, setRoomLoading] = React.useState(true);
  const [tablesLoading, setTablesLoading] = React.useState(true);
  const [usersLoading, setUsersLoading] = React.useState(true);

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
      if (snapshot.exists) {
        const data = snapshot.data() as DBRoom;
        setDBRoom(data);
      } else {
        setError("Roomo does not exist");
      }

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

  const result: Result = React.useMemo(() => {
    if (error != null) {
      return { roomId, ...errorValue(error) };
    }

    if (
      dbRoom == null ||
      roomId == null ||
      roomLoading ||
      tablesLoading ||
      usersLoading
    ) {
      return { roomId, ...loadingValue() };
    }

    const room = createRoom(roomId, dbRoom, dbTables, dbRoomUsers);
    return { roomId, ...dataValue(room) };
  }, [
    roomId,
    dbRoom,
    dbTables,
    dbRoomUsers,
    roomLoading,
    tablesLoading,
    usersLoading,
    error,
  ]);

  return result;
};

export default useData;
