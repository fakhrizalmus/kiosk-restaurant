require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const bp = require("body-parser");
const PORT = process.env.PORT
const router = require("./routes/index")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router, express.static('public'))

app.get("/", (req, res) => {
  res.send("halo");
  console.log("test");
});

app.listen(PORT, () => {
  console.log(`dengar di ${PORT}`);
});
