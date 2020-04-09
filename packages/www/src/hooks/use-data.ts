import * as React from "react";
import { DBRoom, DBTable, Room, Table, User } from "../types";
import { roomsCollection, tablesCollection } from "../db";

const createRoom = (
  roomId: string,
  dbRoom: DBRoom,
  dbTables: { [id: string]: DBTable },
): Room | null => {
  const tables: { [id: string]: Table } = {};
  for (const [tableId, dbTable] of Object.entries(dbTables)) {
    tables[tableId] = {
      id: tableId,
      name: dbTable.name,
      users: {},
    };
  }

  const room: Room = {
    id: roomId,
    name: dbRoom.name,
    quizMaster: dbRoom.quizMaster ?? null,
    tables,
    users: {},
  };

  return room;
};

const useData = (roomId: string) => {
  const [dbRoom, setDBRoom] = React.useState<DBRoom | null>(null);
  const [dbTables, setDBTables] = React.useState<{ [id: string]: DBTable }>({});

  React.useEffect(() => {
    const unsubscribe = roomsCollection.doc(roomId).onSnapshot((snapshot) => {
      const data = snapshot.data() as DBRoom;
      setDBRoom(data);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  React.useEffect(() => {
    const unsubscribe = tablesCollection
      .where("roomId", "==", roomId)
      .onSnapshot((snapshot) => {
        const dbTables: { [id: string]: DBTable } = {};

        for (const doc of snapshot.docs) {
          dbTables[doc.id] = doc.data() as DBTable;
        }

        setDBTables(dbTables);
      });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const room: Room | null = React.useMemo(() => {
    if (dbRoom == null) {
      return null;
    }

    return createRoom(roomId, dbRoom, dbTables);
  }, [roomId, dbRoom, dbTables]);

  return room;
};

export default useData;
