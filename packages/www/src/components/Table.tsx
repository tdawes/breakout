/** @jsx jsx */
import { Flex, Grid, Box, jsx, Button } from "theme-ui";
import GameHeader from "./GameHeader";
import TableHeader from "./TableHeader";
import UserVideo from "./UserVideo";
import Scratchpad from "./Scratchpad";
import { useTable } from "../providers/table";
import { LoadingCenter } from "./Loading";

const Table = () => {
  const { table } = useTable();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      {table == null ? (
        <LoadingCenter />
      ) : (
        <Box>
          <GameHeader />
          <TableHeader />

          <Grid
            gap={2}
            sx={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              px: 3,
              pb: 5,
            }}
          >
            {Object.keys(table.users).map((k) => (
              <UserVideo
                key={k}
                image={`https://source.unsplash.com/random/300x300`}
                title={table.users[k].name}
                sx={{ height: 300 }}
              />
            ))}
          </Grid>
        </Box>
      )}

      {table != null && (
        <Scratchpad sx={{ position: "fixed", bottom: 0, right: 0 }} />
      )}
    </Box>
  );
};

export default Table;
