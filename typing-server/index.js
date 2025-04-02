import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from 'cors'
// Initialize the app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",  // Allow all origins for testing
      methods: ["GET", "POST"]
    }
  });

app.use(cors())

// Serve static files (optional)
app.use(express.static("public"));

const generateRandomString = (length) => {
    // const chars = 'abcdefghijklmnopqrstuvwxyz';
    const chars = "poi"
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];  // Add random character to the result
    }
    return result;
  };

// Handle WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send a random number every second
  setInterval(() => {
    const randomString = generateRandomString(10)
    socket.emit("randomString", randomString); // Emit event to client
  }, 4500);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
const PORT = 5000;
server.listen(PORT,  () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
