/** @jsx jsx */
import { useRouter } from "next/router";
import * as React from "react";
import { Box, jsx } from "theme-ui";
import Layout from "../../../../components/Layout";
import Loading from "../../../../components/Loading";
import Stage from "../../../../components/Stage";
import Table from "../../../../components/Table";
import { useRoom } from "../../../../providers/room";
import { useTable } from "../../../../providers/table";

const TablePage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const tableId = router.query.tableId as string;

  const { room, changeRoom } = useRoom();
  const { table, changeTable } = useTable();

  React.useEffect(() => {
    changeRoom(roomId);
    changeTable(tableId);
  }, [roomId, tableId]);

  if (room == null || table == null) {
    return <Loading />;
  }

  return (
    <Layout title={`${tableId} - ${roomId}`}>
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
