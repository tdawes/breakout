/** @jsx jsx */
import * as React from "react";
import { Box, Flex, Grid, jsx, Text } from "theme-ui";
import { useTable } from "../providers/table";
import Avatar from "./Avatar";

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
        <Text sx={{ fontSize: 4, pr: 4 }}>This table</Text>
        <TableStats sx={{ display: ["flex", "flex", "none"] }} />
      </Flex>

      <Flex sx={{ justifyContent: "flex-end" }}>
        <TableStats sx={{ display: ["none", "none", "flex"] }} />

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
      </Flex>
    </Box>
  );
};

export default TableHeader;
