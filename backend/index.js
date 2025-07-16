require('dotenv').config();
const express = require('express')
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
    methods: ["GET", "POST"]
  }
});
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.get("/", (req, res) => {
  res.send("halo");
  console.log("test");
});

io.on('connection', (socket) => {
  console.log('🔌 a user connected');
});

server.listen(PORT, () => {
  console.log(`dengar di ${PORT}`);
});
