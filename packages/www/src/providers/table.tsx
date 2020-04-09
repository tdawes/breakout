import * as React from "react";
import { Table } from "../types";
import { useRoom } from "./room";

export interface TableState {
  table: Table | null;
  changeTable: (tableId: string) => void;
}

const TableContext = React.createContext<TableState>({} as TableState);

export const useTable = () => React.useContext(TableContext);

export const TableProvider: React.FC = (props) => {
  const [tableId, setTableId] = React.useState<string | null>(null);
  const { room } = useRoom();

  const table: Table | null = React.useMemo(() => {
    if (room == null || tableId == null) {
      return null;
    }

    return room.tables[tableId] ?? null;
  }, [tableId, room]);

  const changeTable = (tableId: string) => setTableId(tableId);

  const value: TableState = {
    table,
    changeTable,
  };

  return (
    <TableContext.Provider value={value}>
      {props.children}
    </TableContext.Provider>
  );
};
