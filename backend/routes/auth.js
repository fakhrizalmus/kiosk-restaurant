const express = require("express")
const router = express.Router()
const { register, login, logout, infoLogin } = require('../controllers/auth')
const auth = require("../misc/middleware");

router.post("/register", register);
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", auth, infoLogin)

module.exports = router