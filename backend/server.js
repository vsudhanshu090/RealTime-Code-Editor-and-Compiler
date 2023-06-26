const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);

    console.log("h");
    console.log(clients);
    
    clients.forEach(({socketId}) => {
        io.to(socketId).emit("joined", {
            clients,
            username,
            socketId: socket.id,
        });
    })
  });
});


server.listen(6009, () => {
  console.log("Server is running on port 6009");
});