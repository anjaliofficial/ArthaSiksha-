const express = require('express')
const router = express.Router();
const { getAllUsers, getUserById, createUser, editUser, deleteUser } = require('../controllers/usersController');
const authenticate = require('../middleware/authentication');

router.get("/getAllUsers", authenticate, getAllUsers);
router.get("/getUserById/:id", authenticate, getUserById);
router.post("/createUser", authenticate, createUser);
router.put("/editUser/:id", authenticate, editUser);
router.delete("/deleteUser/:id", authenticate, deleteUser);

module.exports = router