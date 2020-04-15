/** @jsx jsx */
import { Box, jsx } from "theme-ui";
import ErrorPage from "../../../../../components/ErrorPage";
import JoinRoom from "../../../../../components/JoinRoom";
import Layout from "../../../../../components/Layout";
import { LoadingCenter } from "../../../../../components/Loading";
import Stage from "../../../../../components/Stage";
import Table from "../../../../../components/Table";
import { useEnsureMasterTable } from "../../../../../hooks/use-ensure-master";
import useRoomTablePage from "../../../../../hooks/use-room-table-page";
import { useRoom } from "../../../../../providers/room";
import { useTable } from "../../../../../providers/table";
import { useUser } from "../../../../../providers/user";
import JoinTable from "../../../../../components/JoinTable";

const TablePage = () => {
  useRoomTablePage();
  useEnsureMasterTable();

  const { data: room, error: roomError } = useRoom();
  const { data: table, error: tableError } = useTable();
  const { loading: userLoading } = useUser();

  if (roomError != null || tableError != null) {
    return (
      <Layout>
        <ErrorPage>{roomError ?? tableError}</ErrorPage>
      </Layout>
    );
  }

  if (room == null || table == null || userLoading) {
    return (
      <Layout>
        <LoadingCenter sx={{ minHeight: "100vh" }} />
      </Layout>
    );
  }

  return (
    <Layout title={`${table.name} - ${room.name}`}>
      <JoinRoom />
      <JoinTable />
      <Box
        sx={{
          display: ["block", "flex"],
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: ["100%", "33%"],
            minWidth: ["100%", "stage"],
          }}
        >
          <Stage />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Table />
        </Box>
      </Box>
    </Layout>
  );
};

export default TablePage;
