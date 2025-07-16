const express = require("express")
const router = express.Router()
const {getPesanan} = require('../controllers/pesanan')

router.get("/", getPesanan);

module.exports = router