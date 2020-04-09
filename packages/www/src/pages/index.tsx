/** @jsx jsx */
import * as React from "react";
import { jsx, Text, Styled, Box, Button, Input } from "theme-ui";
import Layout from "../components/Layout";
import Router from "next/router";
import Container from "../components/Container";
import Link from "../components/Link";

const Home = () => {
  const [roomId, setRoomId] = React.useState("");

  return (
    <Layout>
      <Container>
        <Box sx={{ pt: 6, width: "measure", mx: "auto" }}>
          <Text variant="display" sx={{ mt: 0, mb: 5, textAlign: "center" }}>
            Breakout
          </Text>

          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (roomId.trim() !== "") {
                Router.push("/room/[roomId]", `/room/${roomId}`);
              }
            }}
          >
            <Input
              value={roomId}
              placeholder="Room name"
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
            />

            <Button variant="subtle" sx={{ mt: 3 }}>
              Enter
            </Button>
          </Box>

          <Box sx={{ pt: 4 }}>
            <Link href="/admin">Admin page</Link>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Home;
