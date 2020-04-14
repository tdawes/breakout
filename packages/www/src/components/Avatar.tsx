/** @jsx jsx */
import { Text, Flex, Box, jsx, Button } from "theme-ui";
import { Star } from "react-feather";
import { userInfo } from "os";

const defaultSize = 20;

const Avatar: React.FC<{
  name: string;
  isQuizMaster?: boolean;
  size?: number;
  onClick?: () => void;
}> = (props) => {
  const size = props.size ?? defaultSize;

  return (
    <Flex
      {...props}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        cursor: props.onClick != null ? "pointer" : "initial",
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: size * size,
          bg: "peachpuff",
          position: "relative",
        }}
      >
        {props.isQuizMaster && (
          <Box
            sx={{ position: "absolute", top: 0, right: 0, color: "grey.200" }}
          >
            <Star size={size} />
          </Box>
        )}
      </Box>
      <Text sx={{ fontSize: 1, pt: 0 }}>{props.name}</Text>
    </Flex>
  );
};

export default Avatar;
