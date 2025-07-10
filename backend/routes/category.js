const express = require("express")
const router = express.Router()
const {getCategory, addCategory, updateCategory, deleteCategory} = require('../controllers/category')

router.get("/", getCategory);
router.post("/", addCategory)
router.put("/:id", updateCategory)
router.delete("/:id", deleteCategory)

module.exports = router