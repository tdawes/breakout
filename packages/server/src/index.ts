import * as http from "http";
import socketIO from "socket.io";

const server = http.createServer();
const io = socketIO(server);

const port = process.env.PORT || 4000;

io.on("connection", (client) => {
  client.on("join", ({ roomId }: { roomId: string }) => {
    console.log(`client ${client.id} joined room ${roomId}`);
    client.join(roomId);
  });

  client.on("leave", ({ roomId }: { roomId: string }) => {
    console.log(`client ${client.id} leaving room ${roomId}`);
    client.leave(roomId);
  });

  client.on("disconnect", () => {
    console.log("client disconnected");
  });
});

server.listen(port, () => {
  console.log("server started on port", port);
});
