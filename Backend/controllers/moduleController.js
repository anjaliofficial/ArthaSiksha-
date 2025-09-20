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

const getModuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // 👈 current logged-in user

        // Get the module itself
        const moduleResult = await pool.query(
            'SELECT * FROM modules WHERE id = $1',
            [id]
        );
        if (moduleResult.rows.length === 0) {
            return res.status(404).json({ message: 'Module not found' });
        }
        const module = moduleResult.rows[0];

        // Get progress for this user & module
        const progressResult = await pool.query(
            'SELECT completed, progress_percent FROM moduleprogress WHERE user_id = $1 AND module_id = $2',
            [userId, id]
        );

        const progress = progressResult.rows[0] || { completed: false, progress_percent: 0 };

        // Send both module + progress
        res.status(200).json({
            module,
            completed: progress.completed,
            progressPercent: progress.progress_percent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const createModule = async (req, res) => {
    const { title, description, content } = req.body;
    const contentJSON = typeof content === 'string' ? JSON.parse(content) : content;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    try {
        const newModule = await pool.query(
            'INSERT into modules (title, description, content) VALUES ($1, $2, $3) RETURNING *',
            [title, description, contentJSON]
        )
        res.status(201).json({ module: newModule.rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const editModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content } = req.body;
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied. Admins only.'})
        }
        const updatedModule = await pool.query(
            'UPDATE modules SET title = COALESCE($1, title), description = COALESCE($2, description), content = COALESCE($3, content), updated_at = NOW() WHERE id=$4 RETURNING *',
            [title, description, content, id]
        )
        if (updatedModule.rows.length === 0)
            return res.status(404).json({ message: 'Module not found' });

        res.status(200).json({ module: updatedModule.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteModule = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied. Admins only.'})
        }
        const deletedModule = await pool.query('DELETE FROM modules WHERE id=$1 RETURNING *', [id])
        if (deletedModule.rows.length === 0)
            return res.status(404).json({ message: 'Module not found' });
        res.status(200).json({ message: 'Module deleted', module: deletedModule.rows[0] });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Server error' });
    }
}

const updateModuleProgress = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const userId = req.user.id;

        // Default to 100 if nothing is provided
        const progressPercent = 100;

        const result = await pool.query(
            'INSERT INTO moduleprogress (user_id, module_id, progress_percent, completed) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, module_id) DO UPDATE SET progress_percent = $3, completed = $4',
            [userId, moduleId, progressPercent, progressPercent === 100]
        );

        res.status(200).json({ message: 'Progress updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const completeModule = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            'UPDATE moduleprogress SET completed = TRUE, progress_percent = 100, updated_at = NOW() WHERE user_id = $1 AND module_id = $2 RETURNING *',
            [userId, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Progress record not found' });
        }
        res.status(200).json({ message: 'Module marked as completed', progress: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const searchModules = async (req, res) => {
    try {
        const { query } = req.query;
        const searchResults = await pool.query(
            'SELECT * FROM modules WHERE title ILIKE $1 OR description ILIKE $1',
            [`%${query}%`]
        );
        res.status(200).json({ modules: searchResults.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getAllModules, getModuleById, createModule, editModule, deleteModule, updateModuleProgress, completeModule, searchModules };