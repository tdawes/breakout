/** @jsx jsx */
import { useRouter } from "next/router";
import * as React from "react";
import { ChevronDown, ChevronLeft } from "react-feather";
import { Box, Flex, jsx } from "theme-ui";
import Layout from "../../../../../../components/Layout";
import Link from "../../../../../../components/Link";
import Loading from "../../../../../../components/Loading";
import Stage from "../../../../../../components/Stage";
import Table from "../../../../../../components/Table";
import { useRoom } from "../../../../../../providers/room";
import { useTable } from "../../../../../../providers/table";
import { useUser } from "../../../../../../providers/user";

export const quizmasterHeaderHeight = "40px";

export const NotQuizMaster = () => (
  <Layout>
    <Flex
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      Sorry, this view is only for the quizmaster.
    </Flex>
  </Layout>
);

const TablePage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const tableId = router.query.tableId as string;

  const { data: room, changeRoom } = useRoom();
  const { data: table, changeTable } = useTable();
  const { data: user, setStage } = useUser();

  React.useEffect(() => {
    changeRoom(roomId);
    changeTable(tableId);
  }, [roomId, tableId]);

  // the quizmaster is removed from stage when visiting a table
  React.useEffect(() => {
    if (room == null || user == null || room.quizMaster !== user.id) {
      return;
    }

    setStage(false);
  }, [room, user]);

  if (room == null || table == null) {
    return <Loading />;
  }

  if (!user || room.quizMaster != user.id) {
    return <NotQuizMaster />;
  }

  return (
    <Layout title={`${tableId} - ${roomId} - master`}>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          height: quizmasterHeaderHeight,
        }}
      >
        <Link
          as={`/room/${room.id}/master`}
          href="/room/[roomId]/master"
          sx={{ textDecoration: "none" }}
        >
          <Flex sx={{ alignItems: "center" }}>
            <ChevronLeft /> Back
          </Flex>
        </Link>
        <Box>Currently visiting: {table.name.toUpperCase()}</Box>
        <Link
          as={`/room/${room.id}/master`}
          href="/room/[roomId]/master"
          sx={{ textDecoration: "none" }}
        >
          <Flex sx={{ alignItems: "center" }}>
            Go to table <ChevronDown />
          </Flex>
        </Link>
      </Flex>
      <Box
        sx={{
          display: ["block", "flex"],
          minHeight: `calc(100vh - ${quizmasterHeaderHeight})`,
          maxHeight: `calc(100vh - ${quizmasterHeaderHeight})`,
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
        <Flex sx={{ flexGrow: 1, flexDirection: "column" }}>
          <Table sx={{ maxHeight: "calc(100vh - 100px)" }} />
        </Flex>
      </Box>
    </Layout>
  );
};

export default TablePage;
