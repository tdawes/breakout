export interface User {
  id: string;
  name: string;
  roomId: string | null;
  tableId: string | null;
  onStage: boolean;
}

export interface Room {
  id: string;
  name: string;
  users: Keyed<User>;
  tables: Keyed<Table>;
  quizMaster: string | null;
  scratchpadsEditable: boolean;
}

export interface Table {
  id: string;
  name: string;
  users: Keyed<User>;
  roomId: string;
  scratchpad: string;
}

export type Keyed<T> = { [id: string]: T };

export interface DBUser {
  name: string;
  roomId: string | null;
  tableId: string | null;
  onStage: boolean;
}

export interface DBRoom {
  name: string;
  quizMaster: string | null;
  scratchpadsEditable?: boolean;
}

export interface DBTable {
  name: string;
  roomId: string;
  scratchpad?: string;
}

export type LoadingValue<T> =
  | {
      loading: true;
      error: null;
      data: null;
    }
  | {
      loading: false;
      error: string;
      data: null;
    }
  | {
      loading: false;
      error: null;
      data: T;
    };
