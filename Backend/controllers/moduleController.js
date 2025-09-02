const pool = require("../db");

const getAllModules = async (req, res) => {
    try {
        const allMods = await pool.query('SELECT * FROM modules');
        if (allMods.rows.length === 0) 
            return res.status(404).json({ message: 'No modules found' });

        res.status(200).json({modules: allMods.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getModuleById = async(req, res) => {
    try {
        const getWithID = await pool.query('SELECT * FROM modules WHERE id = $1', [req.params.id]);
        if (getWithID.rows.length === 0) 
            return res.status(404).json({ message: 'Module not found' });

        res.status(200).json({module: getWithID.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const createModule = async (req, res) => {
    const { title, description, content } = req.body;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    try {
        const newModule = await pool.query(
            'INSERT into modules (title, description, content) VALUES ($1, $2, $3) RETURNING *',
            [title, description, content]
        )
        res.status(201).json({ module: newModule.rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getAllModules, getModuleById, createModule };