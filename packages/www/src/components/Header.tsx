/** @jsx jsx */
import * as React from "react";
import { Box, Flex, jsx } from "theme-ui";
import Link from "./Link";
import { PenTool } from "react-feather";
import Nav from "./Nav";

const Header: React.FC<{ home?: string }> = (props) => (
  <Flex
    sx={{
      py: [2, 3],
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Link variant="nav" href={props.home || "/"}>
        breakout
      </Link>
    </Box>

    <Nav />
  </Flex>
);

export default Header;
