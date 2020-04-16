/** @jsx jsx */
import * as React from "react";
import { Box, Button, Flex, jsx, Text } from "theme-ui";
import AvatarList from "../../../components/AvatarList";
import ErrorPage from "../../../components/ErrorPage";
import JoinRoom from "../../../components/JoinRoom";
import Layout from "../../../components/Layout";
import Link from "../../../components/Link";
import ListItem, { ListItemHover } from "../../../components/ListItem";
import { LoadingCenter } from "../../../components/Loading";
import RoomHeader from "../../../components/RoomHeader";
import Stage from "../../../components/Stage";
import { useEnsureMasterRoom } from "../../../hooks/use-ensure-master";
import useRoomTablePage from "../../../hooks/use-room-table-page";
import { useRoom } from "../../../providers/room";
import { Table } from "../../../types";

const TableItem: React.FC<{ table: Table }> = ({ table }) => {
  const {
    currentRoom: { data: room },
    currentUser: { data: user },
    setTable,
  } = useRoom();
  const isUsersTable = user != null && user.tableId === table.id;

  if (room == null) return null;

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
            <AvatarList users={Object.values(table.users)} sx={{ pt: 2 }} />
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
};

const TableList: React.FC = (props) => {
  const {
    currentRoom: { data: room },
  } = useRoom();

  if (room == null) {
    return null;
  }

  return (
    <Box {...props}>
      {Object.values(room.tables).map((table) => (
        <TableItem key={table.id} table={table} />
      ))}
    </Box>
  );
};

const RoomPage = () => {
  useEnsureMasterRoom();
  useRoomTablePage();

  const {
    currentRoom: { data: room, error: roomError, loading: roomLoading },
    currentUser: { loading: userLoading },
  } = useRoom();

  if (roomError != null) {
    return (
      <Layout>
        <ErrorPage>{roomError}</ErrorPage>
      </Layout>
    );
  }

  if (userLoading || roomLoading) {
    return (
      <Layout>
        <LoadingCenter sx={{ minHeight: "100vh" }} />
      </Layout>
    );
  }

  const usersNoTable = Object.values(room?.users ?? {}).filter(
    (u) => u.tableId == null,
  );

  return (
    <Layout title={room?.name}>
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
          <Stage />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          <RoomHeader />

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
