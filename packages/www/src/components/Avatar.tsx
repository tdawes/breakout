/** @jsx jsx */
import { Text, Flex, Box, jsx, Button } from "theme-ui";

const defaultSize = 20;

const Avatar: React.FC<{ name: string; size?: number }> = (props) => {
  const size = props.size ?? defaultSize;

  return (
    <Flex
      {...props}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: size * size,
          bg: "peachpuff",
        }}
      />
      <Text sx={{ fontSize: 1, pt: 0 }}>{props.name}</Text>
    </Flex>
  );
};

export default Avatar;
