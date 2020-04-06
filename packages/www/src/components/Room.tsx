/** @jsx jsx */
import * as React from "react";
import { Box, Input, jsx, Text, Styled, Button } from "theme-ui";
import useWebSockets from "../hooks/use-websockets";

export interface Props {
  roomId: string;
}

const Room: React.FC<Props> = (props) => {
  const { messages, sendMessage } = useWebSockets(props.roomId);
  const [text, setText] = React.useState("");

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim() !== "") {
      sendMessage(text);
      setText("");
    }
  };

  return (
    <Box>
      <Styled.h1>
        Room <span sx={{ color: "primary" }}>{props.roomId}</span>
      </Styled.h1>

      <Box as="form" onSubmit={submitForm}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="your message here"
        />

        <Button sx={{ mt: 2 }}>Send</Button>
      </Box>

      <Box sx={{ pt: 2 }}>
        {messages.map((text, i) => (
          <Text key={i}>{text}</Text>
        ))}

        {messages.length === 0 && (
          <Text sx={{ color: "grey.600", fontSize: 1 }}>
            Messages will appear here
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Room;
