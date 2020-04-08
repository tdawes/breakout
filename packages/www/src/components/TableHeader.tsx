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
        borderRight: ["none", "none", "solid 1px"],
        borderColor: "grey.400",
      }}
    >
      <Text sx={{ fontWeight: "bold" }}>Table {table.id}</Text>
      <Text>{Object.keys(table.users).length} memebers</Text>
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

        <Grid
          gap={2}
          sx={{
            flexGrow: 1,
            minWidth: ["0", "0", "20rem"],
            gridTemplateColumns: "repeat(auto-fill, minmax(3rem, 1fr))",
            pl: [0, 0, 4],
          }}
        >
          {Object.keys(table.users).map((k) => (
            <Avatar key={k} name={table.users[k].name} />
          ))}
        </Grid>
      </Flex>
    </Box>
  );
};

export default TableHeader;
