/** @jsx jsx */
import * as React from "react";
import { IconButton, Box, Button, Input, jsx, Text, Flex } from "theme-ui";
import { useUser } from "../providers/user";
import { Edit2 } from "react-feather";
import Loading from "./Loading";

const ChangeName: React.FC<{
  defaultValue: string;
  onChange: (name: string) => void;
}> = (props) => {
  const [name, setName] = React.useState(props.defaultValue);

  return (
    <Box
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (name !== "") {
          props.onChange(name);
        }
      }}
    >
      <Text>Change your name</Text>

      <Input
        placeholder="your username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button sx={{ mt: 2 }}>Change</Button>
    </Box>
  );
};

const User = () => {
  const { changeName, user } = useUser();
  const [changingName, setChangingName] = React.useState(user?.name === "");

  if (user == null) {
    return <Loading />;
  }

  return (
    <Box>
      {changingName ? (
        <ChangeName
          defaultValue={user.name}
          onChange={(name) => {
            changeName(name);
            setChangingName(false);
          }}
        />
      ) : (
        <Flex sx={{ alignItems: "center" }}>
          <Text sx={{ fontSize: 4 }}>
            You are <span sx={{ color: "primary" }}>{user.name}</span>
          </Text>

          <IconButton onClick={() => setChangingName(true)} sx={{ ml: 2 }}>
            <Edit2 size={16} />
          </IconButton>
        </Flex>
      )}
    </Box>
  );
};

export default User;
