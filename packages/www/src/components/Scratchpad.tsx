/** @jsx jsx */
import * as React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { Box, Flex, jsx, Text, Textarea } from "theme-ui";

export interface Props {
  contents: string;
  saveContents: (newContents: string) => any;
}

const Scratchpad: React.FC<Props> = (props) => {
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
          pb: isOpen ? 2 : 0,
          overflow: "hidden",
          transition: "height 150ms ease-in-out",
        }}
      >
        <Textarea
          value={props.contents}
          onChange={(e) => props.saveContents(e.target.value)}
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
