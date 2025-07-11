const express = require("express")
const router = express.Router()
const {getProduct, addProduct, updateProduct, deleteProduct} = require('../controllers/product')
const multerImage = require('../misc/multerImage')

router.get("/", getProduct);
router.post("/", multerImage.single('image'), addProduct)
router.put("/:id", multerImage.single('image'), updateProduct)
router.delete("/:id", deleteProduct)

module.exports = router