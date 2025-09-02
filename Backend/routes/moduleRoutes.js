const { getAllModules, getModuleById, createModule, editModule, deleteModule } = require("../controllers/moduleController");
const express = require('express');
const router = express.Router();
const auth = require("../middleware/authentication");

router.get('/getAllModules', auth, getAllModules);
router.get('/getModuleById/:id', auth, getModuleById);
router.post('/createModule', auth, createModule);
router.put('/editModule/:id', auth, editModule);
router.delete('/deleteModule/:id', auth, deleteModule);

module.exports = router;