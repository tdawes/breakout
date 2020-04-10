/** @jsx jsx */
import * as React from "react";
import { Box, Flex, Grid, jsx, Text, Button } from "theme-ui";
import { useTable } from "../providers/table";
import Avatar from "./Avatar";
import { pluralize } from "../utils";

const TableStats: React.FC = (props) => {
  const { table } = useTable();

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
  const { table } = useTable();

  if (table == null) {
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
          Your Table:{" "}
          <span sx={{ fontWeight: "bold" }}>
            {table.name}, {numUsers} {pluralize("member", numUsers)}
          </span>
        </Text>
      </Flex>

      <Button>Join Stage</Button>

      <Text sx={{ color: "grey.600" }}>This game</Text>
    </Box>
  );
};

export default TableHeader;
