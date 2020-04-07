import * as React from "react";
import { User } from "../types";

export interface UserState {
  user: User | null;
  loading: boolean;
  changeName: (name: string) => void;
}

const UserContext = React.createContext<UserState>({} as UserState);

export const useUser = () => React.useContext(UserContext);

export const UserProvider: React.FC = (props) => {
  const [user, setUser] = React.useState<User>({
    id: "12345",
    name: "",
  });

  const [loading, setLoading] = React.useState(false);

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
