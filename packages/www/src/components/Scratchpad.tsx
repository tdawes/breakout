/** @jsx jsx */
import * as React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Box, Flex, jsx, Text, Textarea } from "theme-ui";

const ScratchPad: React.FC = (props) => {
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
