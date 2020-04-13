import * as React from "react";
import { User, DBUser } from "../types";
import { getItem, saveItem, clearItem } from "../local";
import useAsyncEffect from "use-async-effect";
import { useRoom } from "./room";
import * as db from "../db";

export interface UserState {
  user: User | null;
  preferredName: string;
  loading: boolean;
  changeName: (name: string) => void;
  createUser: (name: string, roomId: string, tableId?: string) => void;
  setTable: (tableId: string | null) => void;
}

export enum UserLoadedState {
  INIT = 0,
  EMPTY = 1,
  FOUND = 2,
}

const UserContext = React.createContext<UserState>({} as UserState);

export const useUser = () => React.useContext(UserContext);

const userKey = (roomId: string): string => `@breakout/user/${roomId}`;
const nameKey = (): string => "@breakout/name";

const getLocalUserIdForRoom = (roomId: string): Promise<string | null> =>
  getItem<string | null>(userKey(roomId), null);
const saveUserIdForRoom = (roomId: string, userId: string) =>
  saveItem(userKey(roomId), userId);
const deleteUserIdForRoom = (roomId: string) => clearItem(userKey(roomId));
const getLocalName = (): Promise<string> => getItem<string>(nameKey(), "");
const saveName = (name: string) => saveItem(nameKey(), name);

export const UserProvider: React.FC = (props) => {
  const [userLoadedState, setUserLoadedState] = React.useState<UserLoadedState>(
    UserLoadedState.INIT,
  );
  const [user, setUser] = React.useState<User | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [preferredName, setPreferredName] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const { room, loading: roomLoading, error: roomError } = useRoom();

  // get preferred name from local storage when we start
  useAsyncEffect(async () => {
    setPreferredName(await getLocalName());
  }, []);

  // get local userId for room whenever the room changes
  useAsyncEffect(async () => {
    if (roomLoading) {
      return;
    }

    if (room == null || roomError) {
      setUserId(null);
      setUserLoadedState(UserLoadedState.EMPTY);
      return;
    }

    const userId = await getLocalUserIdForRoom(room.id);

    if (userId == null) {
      setUserId(null);
      setUserLoadedState(UserLoadedState.EMPTY);
    } else {
      setUserId(userId);
      setUserLoadedState(UserLoadedState.FOUND);
    }
  }, [room, roomLoading, userId]);

  // subscribe to firestore user object when userId changes
  React.useEffect(() => {
    if (userLoadedState === UserLoadedState.INIT) {
      return;
    }

    if (userId == null) {
      setLoading(false);
      setUser(null);
      return;
    }

    setLoading(true);

    const unsubscribe = db.getUser(userId).onSnapshot((snapshot) => {
      const dbUser = snapshot.data() as DBUser;
      setUser({
        id: snapshot.id,
        ...dbUser,
      });
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [userId, userLoadedState]);

  const changeName = (name: string) => {
    saveName(name);
    throw new Error("not implemented");
  };

  const createUser = async (name: string, roomId: string, tableId?: string) => {
    const user = await db.createUser(name, roomId, tableId);

    // firestore update for room.users will not happen immediately
    // so we add the user manually for our local checks
    // this will not trigger a react state update and that is okay
    if (room != null) {
      room.users[user.id] = user;
    }

    setUser(user);
    setUserId(user.id);
    saveUserIdForRoom(roomId, user.id);
    saveName(user.name);
  };

  const setTable = async (tableId: string | null) => {
    if (user != null) {
      db.setUser({
        ...user,
        tableId,
      });
    }
  };

  const value: UserState = {
    user,
    preferredName,
    loading,
    changeName,
    createUser,
    setTable,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
