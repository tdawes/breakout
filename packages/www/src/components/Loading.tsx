/** @jsx jsx */
import { Flex, jsx, Spinner } from "theme-ui";

const Loading = () => {
  return (
    <Flex
      sx={{
        py: 3,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner />
    </Flex>
  );
};

export default Loading;
