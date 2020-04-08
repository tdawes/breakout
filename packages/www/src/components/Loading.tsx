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

export const LoadingCenter = () => (
  <Flex
    sx={{
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Loading />
  </Flex>
);
