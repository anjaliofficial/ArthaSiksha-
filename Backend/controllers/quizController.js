const pool = require('../db');

const getAllQuizzes = async (req, res) => {
    try {
        const allQuizzes = await pool.query('SELECT * FROM quizzes');
        if (allQuizzes.rows.length === 0) 
            return res.status(404).json({ message: 'No quizzes found' });
        res.status(200).json({ quizzes: allQuizzes.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const getQuizzesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const quizzes = await pool.query('SELECT * FROM quizzes WHERE module_id = $1', [moduleId]);
    if (quizzes.rows.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for this module' });
    }
    res.status(200).json({ quizzes: quizzes.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getQuizById = async (req, res) => {
    try {
        const quiz = await pool.query('SELECT * FROM quizzes WHERE id = $1', [req.params.id]);
        if (quiz.rows.length === 0) 
            return res.status(404).json({ message: 'Quiz not found' }); 
        res.status(200).json({ quiz: quiz.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const createQuiz = async (req, res) => {
    const { module_id, question, options, correct_answer } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Validate input
    if (!module_id || !question || !options || !correct_answer) {
        return res.status(400).json({ message: 'Please provide module_id, question, options, and correct_answer' });
    }

    try {
        const newQuiz = await pool.query(
            `INSERT INTO quizzes (module_id, question, options, correct_answer)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [module_id, question, JSON.stringify(options), correct_answer]
        );

        res.status(201).json({ quiz: newQuiz.rows[0] });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const editQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { module_id, question, options, correct_answer } = req.body;
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied. Admins only.'})
        }
        const updatedQuiz = await pool.query(
            'UPDATE quizzes SET module_id = COALESCE($1, module_id), question = COALESCE($2, question), options = COALESCE($3, options), correct_answer = COALESCE($4, correct_answer), updated_at = NOW() WHERE id=$5 RETURNING *',
            [module_id, question, options ? JSON.stringify(options) : null, correct_answer, id]
        )
        if (updatedQuiz.rows.length === 0)
            return res.status(404).json({ message: 'Quiz not found' });
        res.status(200).json({ quiz: updatedQuiz.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied. Admins only.'})
        }
        const deletedQuiz = await pool.query('DELETE FROM quizzes WHERE id=$1 RETURNING *', [id]);
        if (deletedQuiz.rows.length === 0)
            return res.status(404).json({ message: 'Quiz not found' });
        res.status(200).json({ message: 'Quiz deleted successfully', quiz: deletedQuiz.rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}

const submitQuiz = async (req, res) => {
    try {
        const { quiz_id, answers } = req.body;
        const user_id = req.user.id;

        const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quiz_id]);
        if (quizResult.rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const quiz = quizResult.rows[0];
        const correctAnswer = quiz.correct_answer;

        let score = 0;
        const submittedAnswers = answers || [];
        const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

        submittedAnswers.forEach((ans, index) => {
            if (ans.selected === correctAnswers[index]) {
                score ++;
            }
        });

        const history = await pool.query(
            `INSERT INTO quizhistory (user_id, quiz_id, score, answers, taken_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING *`,
            [user_id, quiz_id, score, JSON.stringify(answers)]
        );

        res.status(201).json({ message: 'Quiz submitted successfully', score, history: history.rows[0] });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    editQuiz,
    deleteQuiz,
    submitQuiz,
    getQuizzesByModule
}; 