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
const user = require("./auth")
const auth = require("../misc/middleware");

router.use("/product", auth, product);
router.use("/category", auth, category);
router.use("/cart", auth, cart);
router.use("/cart-item", auth, cartitem);
router.use("/transaction", auth, transaction)
router.use("/pesanan", auth, pesanan);
router.use("/role", auth, role);
router.use("/permission", auth, permission);
router.use("/auth", user);

module.exports = router