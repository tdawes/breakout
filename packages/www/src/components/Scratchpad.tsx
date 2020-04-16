/** @jsx jsx */
import * as React from "react";
import { ChevronDown, ChevronUp, Delete } from "react-feather";
import { Box, Flex, jsx, Text, Textarea, IconButton } from "theme-ui";
import { useRoom } from "../providers/room";

const Scratchpad: React.FC = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    currentRoom: { data: room },
    currentTable: { data: table },
    currentUser: { data: user },
    setScratchpad,
  } = useRoom();

  const canClear = table && user && table.users[user.id];
  return (
    <Box
      {...props}
      sx={{
        bg: "white",
        color: "background",
        p: 2,
        minWidth: ["100%", "400px"],
        overflow: "hidden",
      }}
    >
      <Flex
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Text>
          Team notes {room?.scratchpadsEditable === false && " (frozen)"}
        </Text>
        <div>
          {isOpen && canClear && (
            <IconButton
              style={{ marginRight: "5px" }}
              title="Clear all notes"
              onClick={(e) => {
                e.stopPropagation();
                setScratchpad("");
              }}
            >
              <Delete size={18} />
            </IconButton>
          )}
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </Flex>

      <Box
        sx={{
          height: isOpen ? "200px" : "0",
          opacity: isOpen ? 1 : 0,
          pb: isOpen ? 2 : 0,
          overflow: "hidden",
          transition: "height 150ms ease-in-out",
        }}
      >
        <Textarea
          value={table?.scratchpad}
          onChange={(e) => setScratchpad(e.target.value)}
          readOnly={room?.scratchpadsEditable === false}
          sx={{
            height: "100%",
            mt: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default Scratchpad;
