/** @jsx jsx */
import { Flex, Box, jsx, Button } from "theme-ui";
import UserVideo from "./UserVideo";

const Stage: React.FC = (props) => {
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
    </Flex>
  );
};

export default Stage;
