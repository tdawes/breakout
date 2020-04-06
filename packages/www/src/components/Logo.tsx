/** @jsx jsx */
import { Box, Flex, jsx, Styled, Text } from "theme-ui";
import logo from "../logo.svg";

const Logo: React.FC = (props) => (
  <img
    {...props}
    sx={{ maxWidth: "3rem", maxHeight: "3rem" }}
    src={logo}
    alt="logo"
  />
);

export default Logo;
