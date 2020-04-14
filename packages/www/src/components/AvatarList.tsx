/** @jsx jsx */
import { Flex, jsx } from "theme-ui";
import { User } from "../types";
import Avatar from "./Avatar";

const AvatarList: React.FC<{
  users: User[];
  quizMaster?: string | null;
  onUserClick?: (userId: string) => void;
}> = (props) => {
  return (
    <Flex
      {...props}
      sx={{
        flexGrow: 1,
        flexWrap: "wrap",
      }}
    >
      {props.users.map((user) => (
        <Avatar
          key={user.id}
          name={user.name}
          sx={{ mr: 3 }}
          isQuizMaster={
            props.quizMaster != null && props.quizMaster === user.id
          }
          onClick={() => {
            if (props.onUserClick) {
              props.onUserClick(user.id);
            }
          }}
        />
      ))}
    </Flex>
  );
};

export default AvatarList;
