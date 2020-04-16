/** @jsx jsx */
import * as React from "react";
import { Trash2 } from "react-feather";
import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Input,
  jsx,
  Styled,
  Text,
} from "theme-ui";
import AvatarList from "../components/AvatarList";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import Link from "../components/Link";
import * as db from "../db";
import useData from "../hooks/use-data";
import useAllRooms from "../hooks/useAllRooms";
import { useRoom } from "../providers/room";
import { Table, User } from "../types";
import useRoomTablePage from "../hooks/use-room-table-page";
import { pluralize } from "../utils";
import Avatar from "../components/Avatar";
import { removeUserIdForRoom } from "../hooks/use-current-user-data";

const Section: React.FC = (props) => <Box sx={{ py: 3 }} {...props} />;

const UserItem: React.FC<{
  user: User;
  roomId: string;
  isQuizMaster?: boolean;
  showPromoteButton?: boolean;
}> = ({ user, isQuizMaster, showPromoteButton, roomId }) => {
  return (
    <Flex
      key={user.id}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Flex>
        <Avatar sx={{ mr: 2 }} isQuizMaster={isQuizMaster} />
        <Text>{user.name}</Text>
      </Flex>

      <Box>
        {showPromoteButton && (
          <Button
            variant="link"
            sx={{ fontSize: 2, color: "muted", mr: 3 }}
            onClick={() => {
              if (isQuizMaster) {
                db.updateRoom(roomId, { quizMaster: null });
              } else {
                db.updateRoom(roomId, { quizMaster: user.id });
              }
            }}
          >
            {isQuizMaster ? "remove as qm" : "set as qm"}
          </Button>
        )}

        <Button
          variant="link"
          sx={{ fontSize: 2, color: "muted" }}
          onClick={() => {
            db.deleteUser(user);
            if (user.roomId != null) {
              removeUserIdForRoom(user.roomId);
            }
          }}
        >
          del
        </Button>
      </Box>
    </Flex>
  );
};

const TableItem: React.FC<{ table: Table }> = ({ table }) => {
  const numMembers = Object.keys(table.users).length;

  return (
    <Box
      sx={{
        flexGrow: 1,
        my: 1,
        p: 2,
        border: "solid 1px",
        borderColor: "grey.200",
      }}
    >
      <Box>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Text>Table {table.name}</Text>
          <Link
            href="/room/[roomId]/table/[tableId]"
            as={`/room/${table.roomId}/table/${table.id}`}
            variant="dark"
            sx={{ fontSize: 1, color: "muted" }}
          >
            go to table
          </Link>
        </Flex>
        <Flex>
          <Text sx={{ fontSize: 1, color: "muted", mr: 3 }}>
            {numMembers} {pluralize("member", numMembers)}
          </Text>
        </Flex>
      </Box>

      {numMembers > 0 && (
        <Box sx={{ pt: 2 }}>
          {Object.values(table.users).map((user) => (
            <UserItem key={user.id} user={user} roomId={table.roomId} />
          ))}
        </Box>
      )}

      <Box sx={{ pt: 2, fontSize: 1, color: "muted" }}>
        <Button variant="link" onClick={() => db.deleteTable(table)}>
          delete table
        </Button>
      </Box>
    </Box>
  );
};

const RoomItem: React.FC<{
  roomId: string;
}> = (props) => {
  const [tableName, setTableName] = React.useState("");
  const { data: room } = useData(props.roomId);

  if (room == null) {
    return null;
  }

  const usersNoTable = Object.values(room.users).filter(
    (user) => user.tableId == null,
  );

  return (
    <Box
      sx={{
        bg: "grey.100",
        color: "black",
        my: 3,
        p: 3,
        borderRadius: 2,
        maxWidth: "500px",
      }}
    >
      <Box sx={{ pr: [0], pb: [2, 0] }}>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Text sx={{ fontSize: 3 }}>{room.name}</Text>
          <Link href="/room/[roomId]" as={`/room/${room.id}`} variant="dark">
            go to room
          </Link>
        </Flex>

        <Box sx={{ fontSize: 1, color: "muted" }}>
          <Flex>
            <Text sx={{ mr: 3, color: "muted" }}>
              {Object.keys(room.users).length} members
            </Text>
            <Text>{Object.keys(room.tables).length} tables</Text>
          </Flex>

          {usersNoTable.length > 0 && (
            <Box sx={{ py: 2 }}>
              {usersNoTable.map((user) => (
                <UserItem
                  key={user.id}
                  user={user}
                  roomId={room.id}
                  isQuizMaster={
                    room.quizMaster != null && room.quizMaster === user.id
                  }
                  showPromoteButton
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {Object.keys(room.tables).length > 0 && (
          <Box>
            {Object.keys(room.tables).map((tableId) => (
              <TableItem key={tableId} table={room.tables[tableId]} />
            ))}
          </Box>
        )}

        <Box
          as="form"
          sx={{ mt: 3, maxWidth: "measure" }}
          onSubmit={(e) => {
            e.preventDefault();
            if (tableName !== "") {
              db.createTable(tableName, room.id);
              setTableName("");
            }
          }}
        >
          <Text>Create table</Text>
          <Input
            value={tableName}
            placeholder="Table Name"
            onChange={(e) => {
              setTableName(e.target.value);
            }}
          />

          <Button variant="subtle" sx={{ mt: 2, py: 1 }}>
            Create
          </Button>
        </Box>

        <Box sx={{ pt: 3, fontSize: 1, color: "muted" }}>
          <Button variant="link" onClick={() => db.deleteRoom(room)}>
            delete room
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const Admin = () => {
  const [roomName, setRoomName] = React.useState("");
  const roomIds = useAllRooms();
  useRoomTablePage();

  return (
    <Layout>
      <Container sx={{ pt: 5 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ minHeight: "100vh" }}>
            <Styled.h1>Breakout Admin</Styled.h1>

            <Section>
              <Box
                as="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (roomName !== "") {
                    db.createRoom(roomName);
                    setRoomName("");
                  }
                }}
              >
                <Styled.h3>Create a room</Styled.h3>
                <Input
                  sx={{ maxWidth: "measure" }}
                  value={roomName}
                  placeholder="Room name"
                  onChange={(e) => {
                    setRoomName(e.target.value);
                  }}
                />

                <Button variant="subtle" sx={{ mt: 3 }}>
                  Create
                </Button>
              </Box>
            </Section>

            <Section>
              <Grid
                gap={2}
                sx={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                }}
              >
                {roomIds.map((id) => (
                  <RoomItem key={id} roomId={id} />
                ))}
              </Grid>
            </Section>
          </Box>

          <Footer />
        </Box>
      </Container>
    </Layout>
  );
};

export default Admin;
