/** @jsx jsx */
import { Text, Flex, Box, jsx, Button } from "theme-ui";

const defaultSize = 20;

const Avatar: React.FC<{ name: string; size?: number }> = (props) => {
  const size = props.size ?? defaultSize;

  return (
    <Flex
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "grey.500",
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: size * size,
          bg: "grey.400",
        }}
      />
      <Text sx={{ fontSize: 1, pt: 1 }}>{props.name}</Text>
    </Flex>
  );
};

export default Avatar;
