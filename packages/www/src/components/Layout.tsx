/** @jsx jsx */
import * as React from "react";
import { Box, jsx } from "theme-ui";
import Header from "./Header";
import SEO from "./SEO";
import Footer from "./Footer";

export interface Props {
  title?: string;
  description?: string;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <SEO title={props.title} description={props.description} />

      <Box
        sx={{
          my: 0,
          py: 0,
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
          }}
        >
          {props.children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
