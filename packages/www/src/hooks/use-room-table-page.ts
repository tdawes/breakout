import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRoom } from "../providers/room";

const useRoomTablePage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const tableId = router.query.tableId as string;

  const { changeRoom, changeTable } = useRoom();

  useEffect(() => {
    changeRoom(roomId ?? null);
    changeTable(tableId ?? null);
  }, [roomId, tableId]);
};

export default useRoomTablePage;
