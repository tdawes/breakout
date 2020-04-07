export interface User {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  users: Keyed<User>;
  tables: Keyed<Table>;
  qm: string | null;
}

export interface Table {
  id: string;
  name: string;
  users: Keyed<User>;
}

export type Keyed<T> = { [id: string]: T };
