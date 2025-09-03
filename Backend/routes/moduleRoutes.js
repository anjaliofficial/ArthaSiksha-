const { getAllModules, getModuleById, createModule, editModule, deleteModule, updateModuleProgress, completeModule } = require("../controllers/moduleController");
const express = require('express');
const router = express.Router();
const auth = require("../middleware/authentication");

router.get('/getAllModules', auth, getAllModules);
router.get('/getModuleById/:id', auth, getModuleById);
router.post('/createModule', auth, createModule);
router.put('/editModule/:id', auth, editModule);
router.delete('/deleteModule/:id', auth, deleteModule);
router.post('/completeModule/:moduleId', auth, updateModuleProgress);
router.put('/markModuleComplete/:id', auth, completeModule);

module.exports = router;