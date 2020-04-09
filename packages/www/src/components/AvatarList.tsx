/** @jsx jsx */
import { Flex, jsx } from "theme-ui";
import { User } from "../types";
import Avatar from "./Avatar";

const AvatarList: React.FC<{ users: User[] }> = (props) => {
  return (
    <Flex
      {...props}
      sx={{
        flexGrow: 1,
        flexWrap: "wrap",
      }}
    >
      {props.users.map((user) => (
        <Avatar key={user.id} name={user.name} sx={{ mr: 3 }} />
      ))}
    </Flex>
  );
};

export default AvatarList;
