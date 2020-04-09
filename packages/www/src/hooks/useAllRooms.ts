import * as React from "react";

const useAllRooms = () => {
  const [roomIds, setRoomIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const unsubscribe = db.roomsCollection.onSnapshot((snapshot) => {
      setRoomIds(snapshot.docs.map((d) => d.id));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return roomIds;
};

export default useAllRooms;
