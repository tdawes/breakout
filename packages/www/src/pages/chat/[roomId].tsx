/** @jsx jsx */
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { jsx } from "theme-ui";
import Layout from "../../components/Layout";

const Room = dynamic(() => import("../../components/Room"), {
  ssr: false,
});

const RoomPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const isOnClient = typeof window !== "undefined";

  return (
    <Layout title={roomId}>{isOnClient && <Room roomId={roomId} />}</Layout>
  );
};

export default RoomPage;
