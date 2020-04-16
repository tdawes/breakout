/** @jsx jsx */
import { Grid, Box, jsx } from "theme-ui";
import TableHeader from "./TableHeader";
import UserVideo from "./UserVideo";
import Scratchpad from "./Scratchpad";
import { LoadingCenter } from "./Loading";
import { useRoom } from "../providers/room";

const Table = () => {
  const {
    currentTable: { data: table },
    currentUser: { data: user },
  } = useRoom();

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
            {Object.keys(table.users).map((k) => {
              const tableUser = table.users[k];

              return (
                <UserVideo
                  user={tableUser}
                  key={k}
                  image={`https://source.unsplash.com/random/300x300`}
                  sx={{ minHeight: 240 }}
                >
                  {tableUser.name}
                  {user != null && user?.id === tableUser.id && (
                    <span> (YOU) </span>
                  )}
                  {tableUser.onStage && (
                    <span>
                      {" "}
                      -{" "}
                      <span sx={{ color: "success", fontWeight: "bold" }}>
                        on stage
                      </span>
                    </span>
                  )}
                </UserVideo>
              );
            })}
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
