/** @jsx jsx */
import { Flex, Box, jsx, Button } from "theme-ui";
import UserVideo from "./UserVideo";
import { loadGetInitialProps } from "next/dist/next-server/lib/utils";

const Stage: React.FC<{ hideJoinButton?: boolean }> = (props) => {
  return (
    <Flex
      sx={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        bg: "indigo",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <UserVideo
          title="Quizmaster"
          image="https://source.unsplash.com/random/300x1000"
          sx={{ minHeight: "400px" }}
        />
      </Box>

      {!props.hideJoinButton && (
        <Box
          sx={{
            px: 2,
            py: 3,
            bg: "grey.400",
            textAlign: "center",
          }}
        >
          <Button sx={{ width: "100%" }}>Join Stage</Button>
        </Box>
      )}
    </Flex>
  );
};

export default Stage;
