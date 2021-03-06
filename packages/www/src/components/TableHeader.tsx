/** @jsx jsx */
import * as React from "react";
import { Box, Flex, jsx, Text, Button } from "theme-ui";
import { pluralize } from "../utils";
import { useRoom } from "../providers/room";
import Link from "./Link";

const TableStats: React.FC = (props) => {
  const {
    currentTable: { data: table },
  } = useRoom();

  if (table == null) {
    return null;
  }

  return (
    <Flex
      {...props}
      sx={{
        flexDirection: "column",
        justifyContent: "center",
        pr: 4,
        borderRight: [
          "none",
          "none",
          Object.keys(table.users).length > 0 ? "solid 1px" : "none",
        ],
        borderColor: "grey.400",
      }}
    >
      <Text sx={{ fontWeight: "bold" }}>Table {table.name}</Text>
      <Text>{Object.keys(table.users).length} members</Text>
    </Flex>
  );
};

const TableHeader = () => {
  const {
    currentTable: { data: table },
    currentUser: { data: user },
    currentRoom: { data: room },
    setStage,
  } = useRoom();

  if (table == null || user == null || room == null) {
    return null;
  }

  const numUsers = Object.keys(table.users).length;

  return (
    <Box
      sx={{
        display: ["block", "block", "flex"],
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
      }}
    >
      <Flex sx={{ justifyContent: "space-between", pb: [3, 3, 0] }}>
        <Text>
          This Table:{" "}
          <span sx={{ fontWeight: "bold" }}>
            {table.name}, {numUsers} {pluralize("member", numUsers)}
          </span>
        </Text>
      </Flex>

      {room.quizMaster !== user.id && (
        <Button
          variant={user.onStage ? "secondary" : "primary"}
          onClick={() => {
            setStage(!user.onStage);
          }}
        >
          {user.onStage ? "Leave Stage" : "Join Stage"}
        </Button>
      )}

      <Link
        href="/room/[roomId]"
        as={`/room/${room.id}`}
        sx={{ color: "grey.600", textDecoration: "none" }}
      >
        Go to room
      </Link>
    </Box>
  );
};

export default TableHeader;
