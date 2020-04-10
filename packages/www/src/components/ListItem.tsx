/** @jsx jsx */
import * as React from "react";
import { Flex, jsx } from "theme-ui";

const ListItem: React.FC = (props) => {
  return (
    <Flex
      {...props}
      sx={{
        p: 3,
        backgroundColor: "grey.500",
        color: "background",
        mb: 3,
        alignItems: "center",
        flexWrap: "wrap",
        position: "relative",
      }}
    >
      {props.children}
    </Flex>
  );
};

export default ListItem;

export const ListItemHover: React.FC = (props) => (
  <Flex
    {...props}
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",

      "&:hover": { opacity: 1 },

      transition: "opacity 150ms ease-in-out",
    }}
  >
    {props.children}
  </Flex>
);
