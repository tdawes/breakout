/** @jsx jsx */
import { Box, Flex, jsx, Text } from "theme-ui";
import { useRoom } from "../providers/room";
import { pluralize } from "../utils";

const RoomHeader = () => {
  const {
    currentRoom: { data: room },
  } = useRoom();

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
        borderBottom: "solid 1px",
        borderColor: "grey.600",
      }}
    >
      <Text>
        This is room <span sx={{ color: "primary" }}>{room.name}</span>
      </Text>
      <Flex sx={{ alignItems: "center" }}>
        <Box sx={{ mr: 4 }}>
          {numTables} {pluralize("table", numTables)}
        </Box>
        <Box>
          {numUsers} {pluralize("member", numUsers)}
        </Box>
      </Flex>
    </Flex>
  );
};

export default RoomHeader;
