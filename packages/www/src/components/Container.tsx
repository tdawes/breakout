/** @jsx jsx */
import * as React from "react";
import { Box, jsx } from "theme-ui";

const Container: React.FC = (props) => (
  <Box
    {...props}
    sx={{
      display: "flex",
      justifyContent: "center",
      minHeight: "100vh",
      maxWidth: "container",
      mx: "auto",
      my: 0,
      px: [3, 4],
      py: 0,
    }}
  />
);

export default Container;
