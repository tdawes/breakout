import * as React from "react";
import useAsyncEffect from "use-async-effect";
import * as db from "../db";
import { clearItem, getItem, saveItem } from "../local";
import { DBUser, LoadingValue, User } from "../types";
import { dataValue, loadingValue } from "../utils";
import { useRoom } from "./room";

export type UserState = LoadingValue<User | null> & {
  preferredName: string;
  changeName: (name: string) => void;
  createUser: (name: string, roomId: string, tableId?: string) => void;
  setTable: (tableId: string | null) => void;
};

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

const usePreferredName = (): [string, (name: string) => void] => {
  const [preferredName, setPreferredName] = React.useState<string>("");

  // get preferred name from local storage when we start
  useAsyncEffect(async () => {
    setPreferredName(await getLocalName());
  }, []);

  const setName = (name: string) => {
    setPreferredName(name);
    saveName(name);
  };

  return [preferredName, setName];
};

export const UserProvider: React.FC = (props) => {
  const [user, setUser] = React.useState<LoadingValue<User | null>>(
    loadingValue(),
  );
  const [userId, setUserId] = React.useState<string | null>(null);
  const [preferredName, setPreferredName] = usePreferredName();
  const { roomId, data: room, loading: roomLoading } = useRoom();

  // reset user state when no room
  React.useEffect(() => {
    if (roomId == null) {
      setUser(loadingValue());
      setUserId(null);
    }
  }, [roomId]);

  // get local userId for room whenever the room changes
  useAsyncEffect(async () => {
    if (roomLoading || room == null) {
      return;
    }

    const localUserId = await getLocalUserIdForRoom(room.id);

    if (localUserId == null) {
      setUserId(null);
      setUser(dataValue(null));
    } else {
      setUserId(localUserId);
    }
  }, [room, roomLoading]);

  // subscribe to firestore user object when userId changes
  React.useEffect(() => {
    if (userId == null) {
      return;
    }

    setUser(loadingValue());

    const unsubscribe = db.getUser(userId).onSnapshot((snapshot) => {
      const dbUser = snapshot.data() as DBUser;
      setUser(
        dataValue({
          id: snapshot.id,
          ...dbUser,
        }),
      );
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const changeName = (name: string) => {
    setPreferredName(name);
    throw new Error("not implemented");
  };

  const createUser = async (name: string, roomId: string, tableId?: string) => {
    const user = await db.createUser(name, roomId, tableId);

    setUser(dataValue(user));
    setUserId(user.id);
    saveUserIdForRoom(roomId, user.id);
    setPreferredName(user.name);
  };

  const setTable = async (tableId: string | null) => {
    if (user.data != null) {
      db.setUser({
        ...user.data,
        tableId,
      });
    }
  };

  const value: UserState = {
    ...user,
    preferredName,
    changeName,
    createUser,
    setTable,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
