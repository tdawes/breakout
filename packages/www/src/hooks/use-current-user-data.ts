import * as React from "react";
import * as db from "../db";
import { LoadingValue, User, DBUser } from "../types";
import { getItem, saveItem } from "../local";
import useAsyncEffect from "use-async-effect";
import { loadingValue, dataValue } from "../utils";

const userKey = (roomId: string): string => `@breakout/user/${roomId}`;
const getLocalUserIdForRoom = (roomId: string): Promise<string | null> =>
  getItem<string | null>(userKey(roomId), null);
const saveUserIdForRoom = (roomId: string, userId: string) =>
  saveItem(userKey(roomId), userId);

const nameKey = (): string => "@breakout/name";
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

export default (roomId: string | null, tableId: string | null) => {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<LoadingValue<User | null>>(
    loadingValue(),
  );
  const [preferredName, setPreferredName] = usePreferredName();

  // reset user state when no room
  React.useEffect(() => {
    if (roomId == null) {
      setUser(loadingValue());
      setUserId(null);
    }
  }, [roomId]);

  // get local userId for room whenever the room changes
  useAsyncEffect(async () => {
    if (roomId == null) {
      return;
    }

    const localUserId = await getLocalUserIdForRoom(roomId);

    if (localUserId == null) {
      setUserId(null);
      setUser(dataValue(null));
    } else {
      setUserId(localUserId);
    }
  }, [roomId]);

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

  const setName = React.useCallback(
    (name: string) => {
      if (userId != null) {
        db.updateUser(userId, { name });
      }
      setPreferredName(name);
    },
    [userId],
  );

  const createUser = React.useCallback(
    async (name: string) => {
      if (roomId != null) {
        const user = await db.createUser(name, roomId, tableId);

        setUser(dataValue(user));
        setUserId(user.id);
        saveUserIdForRoom(roomId, user.id);
        setPreferredName(user.name);
      }
    },
    [user, roomId, tableId],
  );

  const setTable = React.useCallback(
    (tableId: string | null) => {
      if (userId != null) {
        db.updateUser(userId, { tableId, onStage: false });
      }
    },
    [userId],
  );

  const setStage = React.useCallback(
    (onStage: boolean) => {
      if (userId != null) {
        db.updateUser(userId, { onStage });
      }
    },
    [userId],
  );

  return { user, preferredName, setName, createUser, setTable, setStage };
};
