/** @jsx jsx */
import {
  Label,
  Slider,
  Text,
  Checkbox,
  Box,
  jsx,
  Styled,
  Button,
  Link,
  Flex,
  NavLink,
  Grid,
  Field,
  Input,
} from "theme-ui";
import Layout from "../components/Layout";

const Section: React.FC = (props) => <Box {...props} sx={{ py: 2 }} />;
const Color: React.FC = (props) => (
  <Box
    {...props}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
      bg: "muted",
      width: "100%",
      height: "80px",
      fontWeight: "bold",
    }}
  />
);

const Styles = () => (
  <Layout>
    <Box>
      <Styled.h1>These styles are used in app</Styled.h1>
      <Styled.p>
        <Link href="https://theme-ui.com">Theme UI</Link> is used to style the
        app. Try changing the theme in the top right.
      </Styled.p>

      <Section>
        <Grid gap={2} columns={[2, 4]}>
          <Color sx={{ bg: "primary", color: "white" }}>Primary</Color>
          <Color sx={{ bg: "secondary", color: "background" }}>Secondary</Color>
          <Color sx={{ bg: "accent", color: "background" }}>Accent</Color>
          <Color sx={{ bg: "muted", color: "background" }}>Muted</Color>
        </Grid>
      </Section>

      <Section>
        <Styled.h1>Header 1</Styled.h1>
        <Styled.h2>Header 2</Styled.h2>
        <Styled.h3>Header 3</Styled.h3>
        <Styled.h4>Header 4</Styled.h4>
        <Styled.h5>Header 5</Styled.h5>
        <Styled.h6>Header 6</Styled.h6>
        <Styled.p>
          This is a paragraph. Hathor was a major goddess in ancient Egyptian
          religion. As a sky deity, she was the mother or consort of the sky god
          Horus and the sun god Ra, and the symbolic mother of their earthly
          representatives, the pharaohs. She was one of several goddesses who
          acted as the Eye of Ra, Ra's feminine counterpart, and in this form
          she had a vengeful aspect that protected him from his enemies.
        </Styled.p>
      </Section>

      <Section>
        <Link href="/" sx={{ mr: 3 }}>
          internal link
        </Link>
        <Link href="https://prodo.ai">external link</Link>
      </Section>

      <Section>
        <Flex as="nav">
          <NavLink as={Link} href="/">
            these
          </NavLink>

          <NavLink as={Link} href="/about">
            are
          </NavLink>

          <NavLink as={Link} href="/about">
            nav links
          </NavLink>
        </Flex>
      </Section>

      <Section>
        <Flex>
          <Button sx={{ mr: 2 }}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </Flex>
      </Section>

      <Section>
        <Grid gap={3} columns={[1]} sx={{ maxWidth: "400px" }}>
          <Field
            name="placeholder"
            label="label for placeholder"
            placeholder="this is placeholder"
          />
          <Field
            name="value"
            label="label for value"
            defaultValue="this is value"
          />

          <Label>
            <Label>
              <Checkbox defaultChecked={true} />
              <Text>I am a checkbox label</Text>
            </Label>
          </Label>

          <Box>
            <Label>label for slider</Label>
            <Slider defaultValue={25} />
          </Box>
        </Grid>
      </Section>
    </Box>
  </Layout>
);

export default Styles;
