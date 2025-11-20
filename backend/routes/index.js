const express = require("express")
const router = express.Router()
const product = require("./product")
const category = require("./category")
const cart = require("./cart")
const cartitem = require("./cartitem")
const transaction = require("./transaction")
const pesanan = require("./pesanan");
const role = require("./role");
const permission = require("./permission");
// const user = require("./user")
// const restrict = require("../misc/passport");

router.use("/product", product);
router.use("/category", category);
router.use("/cart", cart);
router.use("/cart-item", cartitem);
router.use("/transaction", transaction)
router.use("/pesanan", pesanan);
router.use("/role", role);
router.use("/permission", permission);
// router.use("/auth", user)

module.exports = router