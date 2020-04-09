import * as firebase from "firebase/app";
import "firebase/firestore";
import { DBRoom, DBTable, Room, Table } from "./types";

if (process.env.CONFIG && firebase.apps.length === 0) {
  const config = JSON.parse(process.env.CONFIG);
  firebase.initializeApp(config.firebase);

  if (process.env.NODE_ENV === "development") {
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
  };
  const doc = await roomsCollection.add(dbRoom);
};

export const deleteRoom = async (room: Room) => {
  Object.keys(room.tables).forEach((tableId) => {
    tablesCollection.doc(tableId).delete();
  });

  roomsCollection.doc(room.id).delete();
};

export const deleteTable = async (table: Table) => {
  tablesCollection.doc(table.id).delete();
};
