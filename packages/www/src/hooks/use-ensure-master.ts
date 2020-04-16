import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRoom } from "../providers/room";

export const useEnsureMasterTable = () => {
  const router = useRouter();
  const {
    currentRoom: { data: room },
    currentTable: { data: table },
    currentUser: { data: user },
  } = useRoom();

  useEffect(() => {
    if (
      room != null &&
      table != null &&
      user != null &&
      room.quizMaster === user.id
    ) {
      router.replace(
        "/room/[roomId]/table/[tableId]/master",
        `/room/${room.id}/table/${table.id}/master`,
      );
    }
  }, [room, table, user]);
};

export const useEnsureMasterRoom = () => {
  const router = useRouter();
  const {
    currentRoom: { data: room },
    currentUser: { data: user },
  } = useRoom();

  useEffect(() => {
    if (room != null && user != null && room.quizMaster === user.id) {
      router.replace("/room/[roomId]/master", `/room/${room.id}/master`);
    }
  }, [room, user]);
};
