const pool = require('../db');
const { sendNotificationToAllUsers } = require('./notificationController');

const getAllArticles = async (req, res) => {
    try {
        const allArticles = await pool.query('SELECT * FROM articles');
        if (allArticles.rows.length === 0) 
            return res.status(404).json({ message: 'No articles found' });
        res.status(200).json({ articles: allArticles.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const getArticleById = async (req, res) => {
    try {
        const article = await pool.query('SELECT * FROM articles WHERE id = $1', [req.params.id]);
        if (article.rows.length === 0) 
            return res.status(404).json({ message: 'Article not found' }); 
        res.status(200).json({ article: article.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const createArticle = async (req, res) => {
    const { title, body, tags } = req.body;
    const tagsArray = tags.split(","); // ["no","bye","hii"]

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    try {
        const newArticle = await pool.query(
            'INSERT INTO articles (title, body, tags) VALUES ($1, $2, $3) RETURNING *',
            [title, body, tagsArray]
        );

    await sendNotificationToAllUsers(
    `New article published: "${title}"`,
    "article",
    req.io
);
        res.status(201).json({ article: newArticle.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const editArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body, tags } = req.body;
        const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied. Admins only.'})
        }
        const updatedArticle = await pool.query(
            'UPDATE articles SET title = COALESCE($1, title), body = COALESCE($2, body), tags = COALESCE($3, tags), updated_at = NOW() WHERE id=$4 RETURNING *',
            [title, body, tagsArray, id]
        )
        if (updatedArticle.rows.length === 0)
            return res.status(404).json({ message: 'Article not found' });
        res.status(200).json({ article: updatedArticle.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied. Admins only.'})
        }
        const deletedArticle = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);
        if (deletedArticle.rows.length === 0)
            return res.status(404).json({ message: 'Article not found' });
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const searchArticles = async (req, res) => {
  const query = req.query.query || '';
  const articles = await pool.query(
    `SELECT * FROM articles 
     WHERE title ILIKE $1`,
    [`%${query}%`]
  );
  res.json({ ok: true, articles: articles.rows });
};


module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    editArticle,
    deleteArticle,
    searchArticles
};