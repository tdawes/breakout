/** @jsx jsx */
import { Text, Flex, Box, jsx, Button } from "theme-ui";
import UserVideo from "./UserVideo";
import { useRoom } from "../providers/room";

const Stage: React.FC = (props) => {
  const {
    currentRoom: { data: room },
  } = useRoom();

  if (room == null) {
    return null;
  }

  const usersOnStage = Object.values(room.users).filter((user) => user.onStage);

  return (
    <Flex
      sx={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {usersOnStage.length === 0 && (
        <Flex
          sx={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}
        >
          <Text sx={{ fontSize: 4 }}>The stage is empty</Text>
        </Flex>
      )}

      {usersOnStage.map((user) => (
        <UserVideo
          key={user.id}
          image="https://source.unsplash.com/random/300x1000"
          sx={{ minHeight: "400px" }}
        >
          {room.quizMaster === user.id ? "Quizmaster" : user.name}
        </UserVideo>
      ))}
    </Flex>
  );
};

export default Stage;
