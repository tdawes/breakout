/** @jsx jsx */
import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Box, Flex, jsx, Styled, Text } from "theme-ui";
import Layout from "../../../../components/Layout";
import User from "../../../../components/User";
import { RoomProvider, useRoom } from "../../../../providers/room";
import { UserProvider } from "../../../../providers/user";
import { useTable, TableProvider } from "../../../../providers/table";
import Loading from "../../../../components/Loading";

const TablePage = () => {
  const { room } = useRoom();
  const { table } = useTable();

  if (room == null || table == null) {
    return <Loading />;
  }

  return (
    <Layout title={`${table.id} - ${room.id}`}>
      <Box sx={{ px: [3, 4], pt: 4 }}>
        <Box sx={{ pb: 4 }}>
          <Text>You are in table</Text>
          <Text variant="heading" sx={{ color: "primary", fontSize: 5 }}>
            {table.id}
          </Text>
        </Box>

        <User />
      </Box>
    </Layout>
  );
};

const Page: NextPage = () => {
  const router = useRouter();
  const tableId = router.query.tableId as string;

  const { changeTable } = useTable();

  React.useEffect(() => {
    changeTable(tableId);
  }, []);

  return <TablePage />;
};

export default Page;
