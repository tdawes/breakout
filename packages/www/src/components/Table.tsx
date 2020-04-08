/** @jsx jsx */
import { Box, Grid, jsx } from "theme-ui";
import { useTable } from "../providers/table";
import GameHeader from "./GameHeader";
import { LoadingCenter } from "./Loading";
import ScratchPad from "./Scratchpad";
import TableHeader from "./TableHeader";
import UserVideo from "./UserVideo";

const Table = () => {
  const { table } = useTable();

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
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
        <ScratchPad sx={{ position: "absolute", bottom: 0, right: 0 }} />
      )}
    </Box>
  );
};

export default Table;
