const express = require("express")
const router = express.Router()
const {getPesanan, getPesananDetail} = require('../controllers/pesanan')

router.get("/", getPesanan);
router.get("/:id", getPesananDetail);

module.exports = router