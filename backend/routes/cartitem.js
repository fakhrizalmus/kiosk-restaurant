const express = require("express")
const router = express.Router()
const {getCartItem, addCartItem, updateCartItem, deleteCartItem} = require('../controllers/cartitem')

router.get("/", getCartItem);
router.post("/", addCartItem)
router.put("/:id", updateCartItem)
router.delete("/:id", deleteCartItem)

module.exports = router