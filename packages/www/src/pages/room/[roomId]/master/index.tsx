/** @jsx jsx */
import { useRouter } from "next/router";
import * as React from "react";
import { Box, Flex, jsx, Text, IconButton } from "theme-ui";
import Layout from "../../../../components/Layout";
import Link from "../../../../components/Link";
import Loading from "../../../../components/Loading";
import Stage from "../../../../components/Stage";
import { useRoom } from "../../../../providers/room";
import { Table } from "../../../../types";
import {
  NotQuizMaster,
  quizmasterHeaderHeight,
} from "../table/[tableId]/master";
import { Delete } from "react-feather";

const TableView: React.FC<{ table: Table; roomId: string }> = ({
  table,
  roomId,
}) => (
  <Flex
    key={table.id}
    sx={{
      p: 3,
      backgroundColor: "grey.500",
      color: "background",
      mb: 3,
      alignItems: "center",
      flexWrap: "wrap",
      position: "relative",
    }}
  >
    <Flex
      sx={{
        flexDirection: "column",
        p: 2,
        minWidth: "120px",
      }}
    >
      <Text variant="heading">{table.name}</Text>
      <Text>
        {Object.keys(table.users).length} member
        {Object.keys(table.users).length > 1 && "s"}
      </Text>
    </Flex>
    <Flex>
      {Object.values(table.users).map((user) => (
        <Text
          key={user.id}
          sx={{
            p: 1,
            width: "100px",
            height: "100px",
            textAlign: "center",
            border: "1px solid black",
            mr: 2,
          }}
        >
          {user.name}s face goes here
        </Text>
      ))}
    </Flex>
    <Flex
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        "&:hover": { opacity: 1 },
        transition: "opacity 100ms ease",
      }}
    >
      <Link
        as={`/room/${roomId}/table/${table.id}/master`}
        href="/room/[roomId]/table/[tableId]/master"
        variant="button"
      >
        Visit table
      </Link>
    </Flex>
  </Flex>
);

const MasterPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const {
    currentRoom: { data: room },
    currentUser: { data: user },
    changeTable,
    changeRoom,
    setStage,
    setAllScratchpads,
  } = useRoom();

  React.useEffect(() => {
    changeRoom(roomId);
    changeTable(null);
  }, [roomId]);

  // quizmasters are automatically added to the stage
  React.useEffect(() => {
    if (room == null || user == null || room.quizMaster !== user.id) {
      return;
    }

    setStage(true);
  }, [room, user]);

  if (room == null) {
    return <Loading />;
  }

  if (!user || room.quizMaster != user.id) {
    return <NotQuizMaster />;
  }

  // A couple values here are hardcoded until we have real video
  return (
    <Layout title={room?.id}>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignContent: "center",
          p: 2,
          height: quizmasterHeaderHeight,
          borderBottom: "1px solid",
          borderColor: "grey.500",
        }}
      >
        <div />
        This game has {Object.keys(room.tables).length} tables and{" "}
        {Object.keys(room.users).length} players
        <IconButton
          title="Clear all scratchpads"
          onClick={() => {
            setAllScratchpads("");
          }}
        >
          <Delete size={18} />
        </IconButton>
      </Flex>
      <Flex
        sx={{
          flexDirection: ["column", "row"],
          minHeight: `calc(100vh - ${quizmasterHeaderHeight})`,
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
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Box sx={{ py: 4, px: 3 }}>
            {Object.keys(room.tables).map((k) => (
              <TableView table={room.tables[k]} roomId={room.id} key={k} />
            ))}
          </Box>
        </Box>
      </Flex>
    </Layout>
  );
};

export default MasterPage;
