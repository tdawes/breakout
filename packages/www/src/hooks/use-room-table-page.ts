import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRoom } from "../providers/room";
import { useTable } from "../providers/table";

const useRoomTablePage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const tableId = router.query.tableId as string;

  const { changeRoom } = useRoom();
  const { changeTable } = useTable();

  useEffect(() => {
    changeRoom(roomId ?? null);
    changeTable(tableId ?? null);
  }, [roomId, tableId]);
};

export default useRoomTablePage;
