import * as React from "react";
import { Keyed, Table, Room } from "../types";

export interface TableState {
  table: Table | null;
  loading: boolean;
  changeTable: (tableId: string) => void;
  changeName: (name: string) => void;
}

const TableContext = React.createContext<TableState>({} as TableState);

export const useTable = () => React.useContext(TableContext);

const dummyTable: Table = {
  id: "",
  name: "Table Name",
  users: {
    one: { id: "one", name: "Jake" },
    two: { id: "two", name: "Andreja" },
    three: { id: "three", name: "Tom" },
    four: { id: "four", name: "Bruno" },
    // five: { id: "five", name: "Kai" },
    // six: { id: "six", name: "Sunir" },
  },
};

export const TableProvider: React.FC = (props) => {
  const [table, setTable] = React.useState<Table | null>(null);
  const [loading, setLoading] = React.useState(false);

  const changeTable = (tableId: string) =>
    setTable({
      ...dummyTable,
      id: tableId,
    });

  const changeName = (name: string) => {
    if (table != null) {
      setTable({
        ...table,
        name,
      });
    }
  };

  const value: TableState = {
    table,
    loading,
    changeTable,
    changeName,
  };

  return (
    <TableContext.Provider value={value}>
      {props.children}
    </TableContext.Provider>
  );
};
