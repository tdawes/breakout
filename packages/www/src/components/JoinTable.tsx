/** @jsx jsx */
import * as React from "react";
import { Box, Button, Flex, jsx, Text } from "theme-ui";
import { useRoom } from "../providers/room";
import { useTable } from "../providers/table";
import { useUser } from "../providers/user";
import Modal from "./Modal";
import Link from "./Link";

const JoinTable: React.FC = () => {
  const { data: room } = useRoom();
  const { data: table } = useTable();
  const { data: user, setTable } = useUser();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (user == null || room == null || table == null) {
      setIsModalOpen(false);
      return;
    }

    if (user.tableId == null || user.tableId !== table?.id) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [room, table, user]);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      disableClose={false}
    >
      {room != null && (
        <Box>
          <Text variant="heading" sx={{ fontSize: 4 }}>
            You are not at this table
          </Text>

          <Text>Do you want to leave your table and join this one?</Text>

          <Flex sx={{ pt: 2 }}>
            <Link
              variant="buttonSecondary"
              href="/room/[roomId]/table/[tableId]"
              as={`/room/${room?.id}/table/${user?.tableId}`}
              sx={{ mr: 2 }}
            >
              Go to my table
            </Link>
            <Button
              onClick={() => {
                if (table != null) {
                  setTable(table.id);
                }
              }}
            >
              Join this table
            </Button>
          </Flex>
        </Box>
      )}
    </Modal>
  );
};

export default JoinTable;
