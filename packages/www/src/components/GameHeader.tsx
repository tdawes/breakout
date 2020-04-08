/** @jsx jsx */
import { Text, Flex, Box, jsx, Button } from "theme-ui";
import { useRoom } from "../providers/room";

const GameHeader = () => {
  const { room } = useRoom();

  if (room == null) {
    return null;
  }

  const numTables = Object.keys(room.tables).length;
  const numUsers = Object.keys(room.users).length;

  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        fontSize: 4,
        borderBottom: "solid 1px",
        borderColor: "grey.600",
      }}
    >
      <Text>This game</Text>
      <Flex>
        <Flex sx={{ alignItems: "flex-end", mr: 4 }}>
          <Text sx={{ fontSize: 5, pr: 2 }}>{numTables}</Text>
          <Text sx={{ fontSize: 1 }}>total tables</Text>
        </Flex>
        <Flex sx={{ alignItems: "flex-end" }}>
          <Text sx={{ fontSize: 5, pr: 2 }}>{numUsers}</Text>
          <Text sx={{ fontSize: 1 }}>total members</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GameHeader;
