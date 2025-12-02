require('dotenv').config();
const express = require('express')
const session = require("express-session")
const cookieParser = require("cookie-parser")
const app = express()
const cors = require('cors')
const PORT = process.env.PORT
const router = require("./routes/index")
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // sesuaikan dengan frontend kamu jika perlu
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
const path = require('path');

app.use(cors({
  origin: "http://localhost:3000", // asal frontend
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(
  session({
    secret: "SECRET_SESSION_KEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 hari
    }
  })
)

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', router)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.get("/", (req, res) => {
  res.send("halo");
  console.log("test");
});

io.on('connection', (socket) => {
  console.log('🔌 a user connected');

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });

  socket.on("new_order", (data) => {
    console.log("🛎️ New Order:", data);

    // Broadcast ke semua client lain (admin/dapur)
    socket.broadcast.emit("new_order", data);
  });

  socket.on("join_table", (room) => {
    socket.join(room);
    console.log("Pelanggan bergabung ke", room);
  });
});

server.listen(PORT, () => {
  console.log(`dengar di ${PORT}`);
});
