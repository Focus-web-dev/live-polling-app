const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.get("/api/ping", (req, res) => {
  console.log("Received GET request to /api/ping");
  res.json({ message: "Backend is up and running!" });
});

io.on("connection", (socket) => {
  console.log(`A client connected with ID: ${socket.id}`);

  socket.on("ping", (data) => {
    console.log(`Received ping from ${socket.id}:`, data);

    socket.emit("pong", {
      message: "pong!",
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected with ID: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
  console.log(`Ping endpoint: http://localhost:${PORT}/api/ping`);
});
