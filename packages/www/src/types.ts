export interface User {
  id: string;
  name: string;
  roomId: string | null;
  tableId: string | null;
}

export interface Room {
  id: string;
  name: string;
  users: Keyed<User>;
  tables: Keyed<Table>;
  quizMaster: string | null;
}

export interface Table {
  id: string;
  name: string;
  users: Keyed<User>;
  roomId: string;
}

export type Keyed<T> = { [id: string]: T };

export interface DBUser {
  name: string;
  roomId: string | null;
  tableId: string | null;
}

export interface DBRoom {
  name: string;
  quizMaster?: string;
}

export interface DBTable {
  name: string;
  roomId: string;
}
