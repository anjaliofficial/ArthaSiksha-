// File: ../middleware/authMiddleware.js
const checkAdmin = (req, res, next) => {
    // req.user is set by authenticate middleware
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { checkAdmin };

