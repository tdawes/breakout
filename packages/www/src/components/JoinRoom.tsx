/** @jsx jsx */
import { useRouter } from "next/router";
import * as React from "react";
import { Box, Flex, jsx, Styled, Text, Input, Button } from "theme-ui";
import { useRoom } from "../providers/room";
import { useTable } from "../providers/table";
import Modal from "./Modal";
import { useUser } from "../providers/user";

const maxNameLength = 20;

const JoinRoom: React.FC = () => {
  const { room, loading: roomLoading } = useRoom();
  const { table } = useTable();
  const { user, loading: userLoading, preferredName, createUser } = useUser();

  const [name, setName] = React.useState(preferredName);
  React.useEffect(() => setName(preferredName), [preferredName]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (roomLoading || userLoading || room == null) {
      setIsModalOpen(false);
      return;
    }

    console.log("USER", user, userLoading);

    if (user == null) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [room, table, roomLoading, user, userLoading]);

  return (
    <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
      {room != null && (
        <Box>
          <Text variant="heading" sx={{ fontSize: 4 }}>
            Welcome to Breakout
          </Text>

          <Box
            as="form"
            sx={{ pt: 2 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (name !== "" && name.length <= maxNameLength) {
                createUser(name, room.id, table?.id);
              }
            }}
          >
            <Text>
              Do you want to join the room{" "}
              <span sx={{ fontWeight: "bold" }}>{room.name}</span>
            </Text>

            <Input
              placeholder="your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              sx={{
                mt: 2,
                borderBottomColor: "grey.400",
                "&:focus": { borderBottomColor: "muted" },
              }}
            />

            <Button sx={{ mt: 2 }}>Join</Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default JoinRoom;
