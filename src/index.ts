// Basic socket.io server with express

import cors from "cors";
import { Socket } from "dgram";
import express from "express";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
const server = http.createServer(app);
const positions = {
  player1: {
    x: 0,
    y: 0,
  },
  player2: {
    x: 0,
    y: 0,
  },
  ball: {
    x: 0,
    y: 0,
  },
}
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const PORT = 7000;
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const position = { x: 0, y: 0 };
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
  socket.on("player1", (pos) => {
    positions.player1 = pos;
    io.emit("pos-update", positions);
  });
  socket.on("player2", (pos) => {
    positions.player2 = pos;
    io.emit("pos-update", positions);
  });
  socket.on("ball", (pos) => {
    positions.ball = pos;
    io.emit("ball", pos);
  })
    
});

// setInterval(() => {
//     io.emit("position", {x: Math.round(Math.random() * 100), y: Math.round(Math.random() * 100)});
// }, 100)
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
