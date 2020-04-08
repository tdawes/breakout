/** @jsx jsx */
import { Flex, Box, jsx, Button } from "theme-ui";
import UserVideo from "./UserVideo";

const bottomHeight = 80;

const Stage = () => {
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
    </Flex>
  );
};

export default Stage;
