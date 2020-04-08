import * as React from "react";
import { User } from "../types";

export interface UserState {
  user: User | null;
  loading: boolean;
  changeName: (name: string) => void;
}

const UserContext = React.createContext<UserState>({} as UserState);

export const useUser = () => React.useContext(UserContext);

const nameKey = "@breakout/name";

const getSavedName = (): string | null => {
  try {
    const name = localStorage.getItem(nameKey);
    return name;
  } catch (e) {}

  return null;
};

const saveName = (name: string) => {
  try {
    localStorage.setItem(nameKey, name);
  } catch (e) {}
};

export const UserProvider: React.FC = (props) => {
  const [user, setUser] = React.useState<User>({
    id: "12345",
    name: "",
  });

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const name = getSavedName();
    if (name != null && name !== "") {
      setUser({
        ...user,
        name,
      });
    }
  }, []);

  // save name to local storage
  React.useEffect(() => {
    saveName(user.name);
  }, [user.name]);

  const changeName = (name: string) => {
    setUser({
      ...user,
      name,
    });
  };

  const value: UserState = {
    user,
    loading,
    changeName,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
