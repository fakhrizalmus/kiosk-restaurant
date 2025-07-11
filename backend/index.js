require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const bp = require("body-parser");
const PORT = process.env.PORT
const router = require("./routes/index")
const { Server } = require('socket.io');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const io = new Server(server);

app.use('/api', router)
app.use('/api', express.static(path.join(__dirname, 'public/uploads')))

app.get("/", (req, res) => {
  res.send("halo");
  console.log("test");
});

app.listen(PORT, () => {
  console.log(`dengar di ${PORT}`);
});
