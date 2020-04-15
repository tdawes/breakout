import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRoom } from "../providers/room";
import { useTable } from "../providers/table";
import { useUser } from "../providers/user";

export const useEnsureMasterTable = () => {
  const router = useRouter();
  const { data: room } = useRoom();
  const { data: table } = useTable();
  const { data: user } = useUser();

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
  const { data: room } = useRoom();
  const { data: user } = useUser();

  useEffect(() => {
    if (room != null && user != null && room.quizMaster === user.id) {
      router.replace("/room/[roomId]/master", `/room/${room.id}/master`);
    }
  }, [room, user]);
};
