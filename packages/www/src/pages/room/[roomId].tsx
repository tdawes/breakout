/** @jsx jsx */
import { useRouter } from "next/router";
import * as React from "react";
import { Box, Flex, jsx, Text, Button } from "theme-ui";
import AvatarList from "../../components/AvatarList";
import GameHeader from "../../components/GameHeader";
import Layout from "../../components/Layout";
import { LoadingCenter } from "../../components/Loading";
import Stage from "../../components/Stage";
import { useRoom } from "../../providers/room";
import { useTable } from "../../providers/table";
import { useUser } from "../../providers/user";
import ListItem, { ListItemHover } from "../../components/ListItem";
import Link from "../../components/Link";
import JoinRoom from "../../components/JoinRoom";

const TableList: React.FC = (props) => {
  const { room } = useRoom();
  const { setTable, user } = useUser();

  if (room == null) {
    return null;
  }

  return (
    <Box {...props}>
      {Object.values(room.tables).map((table) => {
        const isUsersTable = user != null && user.tableId === table.id;

        return (
          <ListItem key={table.id}>
            <Box>
              {isUsersTable && (
                <Text sx={{ fontWeight: "bold", textAlign: "center", pb: 2 }}>
                  You are currently in this room
                </Text>
              )}
              <Flex>
                <Box sx={{ pr: 5 }}>
                  <Text>Table {table.name}</Text>
                  <Text sx={{ fontSize: 1, color: "muted", mr: 3 }}>
                    {Object.keys(table.users).length} members
                  </Text>
                </Box>
                <Flex>
                  <AvatarList
                    users={Object.values(table.users)}
                    sx={{ pt: 2 }}
                  />
                </Flex>
              </Flex>
            </Box>

            <ListItemHover>
              {isUsersTable ? (
                <Flex>
                  <Button onClick={() => setTable(null)} sx={{ mr: 2 }}>
                    Leave Table
                  </Button>
                  <Link
                    as={`/room/${room.id}/table/${table.id}`}
                    href="/room/[roomId]/table/[tableId]"
                    variant="button"
                  >
                    Go to table
                  </Link>
                </Flex>
              ) : (
                <Button onClick={() => setTable(table.id)}>Join Table</Button>
              )}
            </ListItemHover>
          </ListItem>
        );
      })}
    </Box>
  );
};

const RoomPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const { room, changeRoom } = useRoom();
  const { changeTable } = useTable();

  React.useEffect(() => {
    changeRoom(roomId);
    changeTable(null);
  }, [roomId]);

  if (room == null) {
    return <LoadingCenter />;
  }

  const usersNoTable = Object.values(room.users).filter(
    (u) => u.tableId == null,
  );

  return (
    <Layout title={room?.id}>
      <JoinRoom />
      <Flex
        sx={{
          minHeight: "100vh",
          flexDirection: ["column", "row"],
        }}
      >
        <Box
          sx={{
            width: ["100%", "33%"],
            minWidth: ["100%", "stage"],
          }}
        >
          <Stage hideJoinButton />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <GameHeader />

          {usersNoTable.length !== 0 && (
            <Box sx={{ pt: 4, px: 3 }}>
              <Text>These users have no table</Text>
              <AvatarList users={usersNoTable} sx={{ pt: 2 }} />
            </Box>
          )}

          <Box sx={{ pt: 4, px: 3 }}>
            <TableList />
          </Box>
        </Box>
      </Flex>
    </Layout>
  );
};

export default RoomPage;
