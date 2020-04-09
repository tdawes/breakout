import * as React from "react";
import { roomsCollection } from "../db";

const useAllRooms = () => {
  const [roomIds, setRoomIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const unsubscribe = roomsCollection.onSnapshot((snapshot) => {
      setRoomIds(snapshot.docs.map((d) => d.id));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return roomIds;
};

export default useAllRooms;
