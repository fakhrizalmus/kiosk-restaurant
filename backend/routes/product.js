const express = require("express")
const router = express.Router()
const {getProduct, addProduct, updateProduct, deleteProduct} = require('../controllers/product')

router.get("/", getProduct);
router.post("/", addProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

module.exports = router