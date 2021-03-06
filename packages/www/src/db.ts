import * as firebase from "firebase/app";
import "firebase/firestore";
import { User, DBRoom, DBTable, Room, Table, DBUser } from "./types";

if (process.env.CONFIG && firebase.apps.length === 0) {
  const config = JSON.parse(process.env.CONFIG);
  firebase.initializeApp(config.firebase);

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("Initialing firebase for", config.firebase.projectId);
  }
}

const firestore = firebase.firestore();

export const usersCollection = firestore.collection("users");
export const roomsCollection = firestore.collection("rooms");
export const tablesCollection = firestore.collection("tables");

export const createTable = (name: string, roomId: string) => {
  const dbTable: DBTable = {
    name,
    roomId,
  };

  tablesCollection.add(dbTable);
};

export const createRoom = async (name: string) => {
  const dbRoom: DBRoom = {
    name,
    quizMaster: null,
  };
  await roomsCollection.add(dbRoom);
};

export const setRoom = async (roomId: string, dbRoom: DBRoom) => {
  roomsCollection.doc(roomId).set(dbRoom);
};

export const updateRoom = (roomId: string, dbRoom: Partial<DBRoom>) => {
  roomsCollection.doc(roomId).update(dbRoom);
};

export const deleteRoom = async (room: Room) => {
  const batch = firestore.batch();

  Object.keys(room.tables).forEach((tableId) => {
    const ref = tablesCollection.doc(tableId);
    batch.delete(ref);
  });

  Object.keys(room.users).forEach((userId) => {
    const ref = usersCollection.doc(userId);
    batch.delete(ref);
  });

  batch.delete(roomsCollection.doc(room.id));

  batch.commit();
};

export const deleteTable = async (table: Table) => {
  tablesCollection.doc(table.id).delete();
};

export const getUser = (userId: string) => usersCollection.doc(userId);

export const createUser = async (
  name: string,
  roomId: string,
  tableId: string | null,
): Promise<User> => {
  const dbUser: DBUser = {
    name,
    roomId,
    tableId,
    onStage: false,
  };

  const result = await usersCollection.add(dbUser);

  const user: User = {
    id: result.id,
    ...dbUser,
  };

  return user;
};

export const updateUser = async (userId: string, user: Partial<User>) => {
  const dbUser: Partial<DBUser> = {
    ...user,
  };

  usersCollection.doc(userId).update(dbUser);
};

export const setTable = async (table: Table) => {
  const dbTable: DBTable = {
    ...table,
  };

  tablesCollection.doc(table.id).set(dbTable);
};

export const updateTable = (tableId: string, dbTable: Partial<DBTable>) => {
  tablesCollection.doc(tableId).update(dbTable);
};

export const deleteUser = (user: User) => {
  usersCollection.doc(user.id).delete();
};
