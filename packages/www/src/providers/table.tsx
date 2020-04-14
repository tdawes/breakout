import * as React from "react";
import { Table, LoadingValue } from "../types";
import { useRoom } from "./room";
import { loadingValue, errorValue, dataValue } from "../utils";
import * as db from "../db";

export type TableState = LoadingValue<Table> & {
  changeTable: (tableId: string | null) => void;
  setScratchpad: (contents: string) => void;
};

const TableContext = React.createContext<TableState>({} as TableState);

export const useTable = () => React.useContext(TableContext);

export const TableProvider: React.FC = (props) => {
  const [tableId, setTableId] = React.useState<string | null>(null);
  const [table, setTable] = React.useState<LoadingValue<Table>>(loadingValue());
  const { data: room, loading: roomLoading } = useRoom();

  React.useEffect(() => {
    if (room == null || tableId == null) {
      setTable(loadingValue());
      return;
    }

    if (room.tables[tableId] != null) {
      setTable(dataValue(room.tables[tableId]));
    } else {
      setTable(errorValue("Table not found"));
    }
  }, [tableId, room, roomLoading]);

  const changeTable = (tableId: string | null) => setTableId(tableId);

  const setScratchpad = async (contents: string) => {
    if (table.data != null) {
      db.setTable({
        ...table.data,
        scratchpad: contents,
      });
    }
  };

  const value: TableState = {
    ...table,
    changeTable,
    setScratchpad,
  };

  return (
    <TableContext.Provider value={value}>
      {props.children}
    </TableContext.Provider>
  );
};
