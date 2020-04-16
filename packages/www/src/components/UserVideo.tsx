/** @jsx jsx */
import { Flex, Box, jsx } from "theme-ui";
import { User } from "../types";
import { useRoom, useVideo } from "../providers/room";

const UserVideo: React.FC<{ image: string; user: User }> = (props) => {
  const tracks = useVideo(props.user.id);

  return (
    <Flex
      {...props}
      sx={{
        alignItems: "flex-end",
        width: "100%",
        height: "100%",
        backgroundImage: `url(${props.image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: 2,
          py: 1,
          bg: "#6665658f",
          fontSize: 1,
        }}
      >
        {props.children}
      </Box>
    </Flex>
  );
};

export default UserVideo;
