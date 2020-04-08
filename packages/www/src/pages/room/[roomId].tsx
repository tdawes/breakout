/** @jsx jsx */
import { NextPage } from "next";
import { useRouter } from "next/router";
import * as React from "react";
import { Box, Flex, jsx, Styled, Text } from "theme-ui";
import Layout from "../../components/Layout";
import Link from "../../components/Link";
import Loading from "../../components/Loading";
import User from "../../components/User";
import { useRoom } from "../../providers/room";

const RoomPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const { room, changeRoom } = useRoom();

  React.useEffect(() => {
    changeRoom(roomId);
  }, [roomId]);

  if (room == null) {
    return <Loading />;
  }

  return (
    <Layout title={roomId}>
      <Box sx={{ px: [3, 4], pt: 4 }}>
        <Box sx={{ pb: 4 }}>
          <Text>You are in room</Text>
          <Text variant="heading" sx={{ color: "primary", fontSize: 5 }}>
            {room.id}
          </Text>
        </Box>

        <User />

        <Box sx={{ maxWidth: 400 }}>
          <Styled.h3>
            There are {Object.keys(room.tables).length} tables
          </Styled.h3>

          {Object.keys(room.tables).map((k) => (
            <Flex key={k} sx={{ justifyContent: "space-between", py: 2 }}>
              <Text>{room.tables[k].name}</Text>
              <Link
                as={`/room/${room.id}/table/${k}`}
                href="/room/[roomId]/table/[tableId]"
              >
                join
              </Link>
            </Flex>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default RoomPage;
