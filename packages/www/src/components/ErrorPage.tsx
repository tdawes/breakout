/** @jsx jsx */
import { Box, Text, Flex, jsx } from "theme-ui";
import Link from "./Link";

export const ErrorPage: React.FC = (props) => {
  return (
    <Flex
      {...props}
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: "measure",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Text sx={{ fontSize: 4 }}>(⌣_⌣”)</Text>
        <Box sx={{ fontSize: 3, py: 2 }}>{props.children}</Box>

        <Link href="/">Go home</Link>
      </Box>
    </Flex>
  );
};

export default ErrorPage;
