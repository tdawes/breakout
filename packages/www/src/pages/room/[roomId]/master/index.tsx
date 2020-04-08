/** @jsx jsx */
import { NextPage } from "next";
import { useRouter } from "next/router";
import * as React from "react";
import { Box, Flex, jsx, Styled, Text } from "theme-ui";
import Layout from "../../../../components/Layout";
import Link from "../../../../components/Link";
import Loading from "../../../../components/Loading";
import { useRoom } from "../../../../providers/room";
import { Table } from "../../../../types";

const TableView = ({ table, roomId }: { table: Table; roomId: string }) => (
  <Flex
    key={table.id}
    sx={{
      p: 3,
      backgroundColor: "muted",
      color: "background",
      mb: 3,
      alignItems: "center",
    }}
  >
    <Flex
      sx={{
        flexDirection: "column",
        px: 2,
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
          {user.name}'s face goes here
        </Text>
      ))}
    </Flex>
  </Flex>
);

const MasterPage = () => {
  const { room } = useRoom();

  if (room == null) {
    return <Loading />;
  }

  return (
    <Layout title={room?.id}>
      <Flex>
        <Box
          sx={{
            minWidth: "100px",
            width: "30%",
            minHeight: "100vh",
            backgroundColor: "peachpuff",
          }}
        >
          Quizmaster's face goes here
          <Text
            sx={{
              minWidth: "100px",
              width: "30%",
              position: "fixed",
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          >
            ⭐Quizmaster
          </Text>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <Flex
            sx={{
              p: 3,
              justifyContent: "space-between",
              borderBottom: "1px solid white",
            }}
          >
            <Text variant="heading">This game</Text>
            <Text>
              {Object.keys(room.users).length} total members in this game
            </Text>
          </Flex>

          <Box sx={{ p: 4 }}>
            {Object.keys(room.tables).map((k) => (
              <TableView table={room.tables[k]} roomId={room.id} key={k} />
            ))}
          </Box>
        </Box>
      </Flex>
    </Layout>
  );
};

const Page: NextPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const { changeRoom } = useRoom();

  React.useEffect(() => {
    changeRoom(roomId);
  }, [roomId]);

  return <MasterPage />;
};

export default Page;
