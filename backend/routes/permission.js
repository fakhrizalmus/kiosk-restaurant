const express = require("express")
const router = express.Router()
const {getAll, addPermission, editPermission, deletePermission} = require('../controllers/permission');

router.get("/", getAll);
router.post("/", addPermission);
router.put("/:id", editPermission);
router.delete("/:id", deletePermission);

module.exports = router