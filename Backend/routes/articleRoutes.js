const express = require('express');
const { getAllArticles, getArticleById, createArticle, editArticle, deleteArticle, searchArticles } = require('../controllers/articleController');
const auth = require("../middleware/authentication");
const router = express.Router();

router.get('/getAllArticles', auth, getAllArticles);
router.get('/getArticleById/:id', auth, getArticleById);
router.post('/createArticle', auth, createArticle);
router.put('/editArticle/:id', auth, editArticle);
router.delete('/deleteArticle/:id', auth, deleteArticle);
router.get('/searchArticles', auth, searchArticles);

module.exports = router;