/** @jsx jsx */
import { useRouter } from "next/router";
import * as React from "react";
import { Box, jsx } from "theme-ui";
import Layout from "../../../../../components/Layout";
import Loading from "../../../../../components/Loading";
import Stage from "../../../../../components/Stage";
import Table from "../../../../../components/Table";
import { useRoom } from "../../../../../providers/room";
import { useTable } from "../../../../../providers/table";
import { useUser } from "../../../../../providers/user";
import JoinRoom from "../../../../../components/JoinRoom";

const TablePage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const tableId = router.query.tableId as string;

  const { room, changeRoom } = useRoom();
  const { table, changeTable } = useTable();
  const { user } = useUser();

  React.useEffect(() => {
    changeRoom(roomId);
    changeTable(tableId);
  }, [roomId, tableId]);

  React.useEffect(() => {
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
  }, [room, user]);

  if (room == null || table == null) {
    return <Loading />;
  }

  return (
    <Layout title={`${table.name} - ${room.name}`}>
      <JoinRoom />
      <Box
        sx={{
          display: ["block", "flex"],
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: ["100%", "33%"],
            minWidth: ["100%", "stage"],
          }}
        >
          <Stage />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Table />
        </Box>
      </Box>
    </Layout>
  );
};

export default TablePage;
