const express = require("express")
const router = express.Router()
const {getAll, addRole, editRole, deleteRole} = require('../controllers/role');

router.get("/", getAll);
router.post("/", addRole);
router.put("/:id", editRole);
router.delete("/:id", deleteRole);

module.exports = router