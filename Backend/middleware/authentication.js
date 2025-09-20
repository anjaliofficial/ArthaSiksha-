const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Check Authorization header or cookie
    const token = req.cookies.token || req.header('Authorization')?.split(' ')[1];

    if (!token) 
        return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Decoded user:", req.user);

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticate;