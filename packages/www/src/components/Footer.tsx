/** @jsx jsx */
import { Box, jsx, Text } from "theme-ui";

const Footer = () => (
  <Box
    as="footer"
    sx={{
      pt: [5, 6],
      pb: 4,
      textAlign: ["center", "left"],
    }}
  >
    <Box
      sx={{
        display: ["flex"],
        flexDirection: ["column-reverse", "row"],
        alignItems: "center",
        justifyContent: "space-between",
        pt: 2,
      }}
    >
      <Text>© 2020 Prodo Tech Ltd</Text>
    </Box>
  </Box>
);

export default Footer;
