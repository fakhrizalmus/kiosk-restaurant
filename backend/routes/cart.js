const express = require("express")
const router = express.Router()
const {getCart, addCart, updateCart, deleteCart} = require('../controllers/cart')

router.get("/", getCart);
router.post("/", addCart)
router.put("/:id", updateCart)
router.delete("/:id", deleteCart)

module.exports = router