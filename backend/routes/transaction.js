const express = require("express")
const router = express.Router()
const {getTransaction, addTransaction, updateTransaction, deleteTransaction, getTransactionCart} = require('../controllers/transaction')

router.get("/", getTransaction);
router.post("/", addTransaction)
router.put("/:id", updateTransaction)
router.delete("/:id", deleteTransaction)
router.get("/kasir", getTransactionCart);

module.exports = router