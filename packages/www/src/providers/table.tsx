import * as React from "react";
import { Table } from "../types";
import { useRoom } from "./room";

export interface TableState {
  table: Table | null;
  loading: boolean;
  error: string | null;
  changeTable: (tableId: string | null) => void;
}

const TableContext = React.createContext<TableState>({} as TableState);

export const useTable = () => React.useContext(TableContext);

export const TableProvider: React.FC = (props) => {
  const [tableId, setTableId] = React.useState<string | null>(null);
  const [table, setTable] = React.useState<Table | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { data: room, loading } = useRoom();

  React.useEffect(() => {
    if (room == null || tableId == null) {
      setTable(null);
      return;
    }

    if (room.tables[tableId] != null) {
      setTable(room.tables[tableId]);
      setError(null);
    } else {
      setError("Table not found");
    }
  }, [tableId, room]);

  const changeTable = (tableId: string | null) => setTableId(tableId);

  const value: TableState = {
    table,
    loading,
    error,
    changeTable,
  };

  return (
    <TableContext.Provider value={value}>
      {props.children}
    </TableContext.Provider>
  );
};
