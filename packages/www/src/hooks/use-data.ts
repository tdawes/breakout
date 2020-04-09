import * as React from "react";
import { roomsCollection, tablesCollection, usersCollection } from "../db";
import { DBRoom, DBTable, Room, Table, Keyed, User, DBUser } from "../types";

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

const useData = (roomId?: string) => {
  const [dbRoom, setDBRoom] = React.useState<DBRoom | null>(null);
  const [dbTables, setDBTables] = React.useState<Keyed<DBTable>>({});
  const [dbRoomUsers, setDBRoomUsers] = React.useState<Keyed<DBUser>>({});
  const [roomLoading, setRoomLoading] = React.useState(true);
  const [tablesLoading, setTablesLoading] = React.useState(true);
  const [usersLoading, setUsersLoading] = React.useState(true);

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

  return {
    room,
    loading: roomLoading || tablesLoading || usersLoading,
  };
};

export default useData;
