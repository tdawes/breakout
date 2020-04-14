/** @jsx jsx */
import { Grid, Box, jsx } from "theme-ui";
import TableHeader from "./TableHeader";
import UserVideo from "./UserVideo";
import Scratchpad from "./Scratchpad";
import { useTable } from "../providers/table";
import { LoadingCenter } from "./Loading";
import { setTable } from "../db";

const Table = () => {
  const { data: table } = useTable();

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
