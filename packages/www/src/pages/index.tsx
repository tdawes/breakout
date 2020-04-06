/** @jsx jsx */
import * as React from "react";
import { jsx, Styled, Box, Button, Input } from "theme-ui";
import Layout from "../components/Layout";
import Router from "next/router";

const Home = () => {
  const [roomId, setRoomId] = React.useState("");

  return (
    <Layout>
      <Styled.h1>Breakout Chat</Styled.h1>

      <Box
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (roomId.trim() !== "") {
            Router.push("/chat/[roomId]", `/chat/${roomId}`);
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
    </Layout>
  );
};

export default Home;
