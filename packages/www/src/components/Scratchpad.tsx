/** @jsx jsx */
import * as React from "react";
import { Text, Flex, Grid, Box, jsx, Button, Textarea } from "theme-ui";
import GameHeader from "./GameHeader";
import TableHeader from "./TableHeader";
import UserVideo from "./UserVideo";
import { useTable } from "../providers/table";
import { LoadingCenter } from "./Loading";
import { ChevronUp, ChevronDown } from "react-feather";

const ScratchPad: React.FC = (props) => {
  const { table } = useTable();
  const [isOpen, setIsOpen] = React.useState(false);

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
        <Text>Team notes</Text>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Flex>

      <Box
        sx={{
          // transform: `scaleY(${isOpen ? "1" : "0"})`,
          height: isOpen ? "200px" : "0",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "height 150ms ease-in-out",
        }}
      >
        <Textarea
          placeholder="your team notes go here"
          sx={{
            height: "100%",
            mt: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default ScratchPad;
