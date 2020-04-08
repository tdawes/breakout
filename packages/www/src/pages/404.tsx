/** @jsx jsx */
import { Box, Flex, jsx, Styled, Text } from "theme-ui";
import Layout from "../components/Layout";
import Link from "../components/Link";
import SEO from "../components/SEO";

const NotFoundPage = () => (
  <Layout>
    <SEO title="Page not found" />
    <Box sx={{ pt: [5, 6], px: [3, 4], maxWidth: "container", mx: "auto" }}>
      <Text sx={{ fontSize: 5 }}>(⌣_⌣”)</Text>
      <Styled.h1>Page Not Found</Styled.h1>
      <Styled.p>Maybe you were trying to go somewhere else?</Styled.p>

      <Link href="/" variant="button">
        Home
      </Link>
    </Box>
  </Layout>
);

export default NotFoundPage;
