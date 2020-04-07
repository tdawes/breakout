/** @jsx jsx */
import * as React from "react";
import { jsx, Styled, Box, Button, Input } from "theme-ui";
import Layout from "../components/Layout";
import Router from "next/router";
import Header from "../components/Header";

const Home = () => {
  const [roomId, setRoomId] = React.useState("");

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "container",
          mx: "auto",
          my: 0,
          px: [3, 4],
          py: 0,
        }}
      >
        <Header />

        <Box sx={{ pt: 4 }}>
          <Styled.h1>Breakout Chat</Styled.h1>

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
              placeholder="any text can be a room"
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
            />

            <Button sx={{ mt: 2 }}>Join</Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
