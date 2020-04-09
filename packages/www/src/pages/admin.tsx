/** @jsx jsx */
import * as React from "react";
import {
  Flex,
  jsx,
  Text,
  Styled,
  Box,
  Button,
  Input,
  IconButton,
} from "theme-ui";
import Layout from "../components/Layout";
import Container from "../components/Container";
import useAllRooms from "../hooks/useAllRooms";
import useData from "../hooks/use-data";
import * as db from "../db";
import { Table } from "../types";
import Avatar from "../components/Avatar";
import Footer from "../components/Footer";
import { Trash2 } from "react-feather";
import Link from "../components/Link";

const Section: React.FC = (props) => <Box sx={{ py: 3 }} {...props} />;

const TableItem: React.FC<{ table: Table }> = ({ table }) => {
  return (
    <Box
      sx={{
        py: 2,
        position: "relative",

        "&:hover": {
          ".deleteTable": { opacity: 1 },
        },
      }}
    >
      <IconButton
        className="deleteTable"
        sx={{
          position: "absolute",
          top: 2,
          right: 4,
          opacity: 0,
          transition: "opacity 150ms ease-in-out",
        }}
        onClick={() => db.deleteTable(table)}
      >
        <Trash2 size={18} />
      </IconButton>

      <Box>
        <Text>Table {table.name}</Text>
        <Flex>
          <Text sx={{ fontSize: 1, color: "muted", mr: 3 }}>
            {Object.keys(table.users).length} members
          </Text>
          <Link
            href="/room/[roomId]/table/[tableId]"
            as={`/room/${table.roomId}/table/${table.id}`}
            variant="dark"
            sx={{ fontSize: 1, color: "muted" }}
          >
            go to table
          </Link>
        </Flex>
      </Box>

      <Flex
        sx={{
          flexGrow: 1,
          flexWrap: "wrap",
          pl: [0, 0, 4],
        }}
      >
        {Object.keys(table.users).map((k) => (
          <Avatar key={k} name={table.users[k].name} sx={{ mr: 3 }} />
        ))}
      </Flex>
    </Box>
  );
};

const RoomItem: React.FC<{
  roomId: string;
}> = (props) => {
  const [tableName, setTableName] = React.useState("");
  const { room } = useData(props.roomId);

  if (room == null) {
    return null;
  }

  return (
    <Flex
      sx={{
        alignItems: ["initial", "center"],
        flexDirection: ["column", "row"],
        bg: "grey.100",
        color: "black",
        my: 3,
        p: 3,
        borderRadius: 2,
        position: "relative",

        "&:hover": {
          ".deleteRoom": { opacity: 1 },
        },
      }}
    >
      <IconButton
        className="deleteRoom"
        sx={{
          position: "absolute",
          top: 1,
          right: 1,
          opacity: 0,
          zIndex: 2,
          transition: "opacity 150ms ease-in-out",
        }}
        onClick={() => db.deleteRoom(room)}
      >
        <Trash2 size={18} />
      </IconButton>

      <Box sx={{ pr: [0, 6], pb: [4, 0] }}>
        <Text sx={{ fontSize: 3 }}>Room {room.name}</Text>
        <Box sx={{ fontSize: 1, color: "muted" }}>
          <Text>{Object.keys(room.users).length} members</Text>
          <Text>{Object.keys(room.tables).length} tables</Text>
          <Link href="/room/[roomId]" as={`/room/${room.id}`} variant="dark">
            go to room
          </Link>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        {Object.keys(room.tables).map((tableId) => (
          <TableItem key={tableId} table={room.tables[tableId]} />
        ))}

        <Box
          sx={{ pt: 4 }}
          as="form"
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

          <Button variant="subtle" sx={{ mt: 3, py: 1 }}>
            Create
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

const Admin = () => {
  const [roomName, setRoomName] = React.useState("");
  const roomIds = useAllRooms();

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
              <Styled.h3>Rooms List</Styled.h3>

              {roomIds.map((id) => (
                <RoomItem key={id} roomId={id} />
              ))}
            </Section>
          </Box>

          <Footer />
        </Box>
      </Container>
    </Layout>
  );
};

export default Admin;
