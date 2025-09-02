const pool = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Setup email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // app password
    }
});

// REGISTER
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: 'All fields required' });

    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (checkUser.rows.length > 0) 
            return res.status(409).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'All fields required' });

    try {
        const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (userRes.rows.length === 0) 
            return res.status(401).json({ message: 'Invalid credentials' });

        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { id: user.id, role: user.role, username: user.username, email: user.email } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// SEND PASSWORD RESET LINK
const sendResetLink = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (userRes.rows.length === 0) 
            return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await pool.query(
            'UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE email=$3',
            [token, expiry, email]
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;

        await transporter.sendMail({
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click the link to reset your password (1 hour):</p><a href="${resetLink}">${resetLink}</a>`
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        console.error("Error in sendResetLink:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// RESET PASSWORD
const resetPasswordWithToken = async (req, res) => {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
        return res.status(400).json({ message: 'All fields required' });

    try {
        const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (userRes.rows.length === 0) 
            return res.status(404).json({ message: 'User not found' });

        const user = userRes.rows[0];
        if (user.reset_token !== token) 
            return res.status(400).json({ message: 'Invalid or expired token' });

        if (new Date() > new Date(user.reset_token_expiry)) 
            return res.status(400).json({ message: 'Token expired' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password=$1, reset_token=NULL, reset_token_expiry=NULL WHERE email=$2',
            [hashedPassword, email]
        );

        res.status(200).json({ message: 'Password reset successful. Please login.' });
    } catch (err) {
        console.error("Error in resetPasswordWithToken:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    sendResetLink,
    resetPasswordWithToken
};
