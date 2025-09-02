const { getAllModules, getModuleById, createModule } = require("../controllers/moduleController");
const express = require('express');
const router = express.Router();
const auth = require("../middleware/authentication");

router.get('/getAllModules', auth, getAllModules);
router.get('/getModuleById/:id', auth, getModuleById);
router.post('/createModule', auth, createModule);

module.exports = router;