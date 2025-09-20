const pool = require('../db');
const { sendNotificationToAllUsers } = require('./notificationController');


// Get all quizzes with questions
const getAllQuizzes = async (req, res) => {
  try {
    const allQuizzes = await pool.query('SELECT * FROM quizzes');

    const quizzesWithQuestions = await Promise.all(
      allQuizzes.rows.map(async (quiz) => {
        const questionsRes = await pool.query('SELECT * FROM questions WHERE quiz_id=$1', [quiz.id]);
        return { ...quiz, questions: questionsRes.rows };
      })
    );

    if (quizzesWithQuestions.length === 0) 
      return res.status(404).json({ message: 'No quizzes found' });

    res.status(200).json({ quizzes: quizzesWithQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quizzes by module with questions
const getQuizzesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const quizzes = await pool.query('SELECT * FROM quizzes WHERE module_id = $1', [moduleId]);

    const quizzesWithQuestions = await Promise.all(
      quizzes.rows.map(async (quiz) => {
        const questionsRes = await pool.query('SELECT * FROM questions WHERE quiz_id=$1', [quiz.id]);
        return { ...quiz, questions: questionsRes.rows };
      })
    );

    if (quizzesWithQuestions.length === 0) 
      return res.status(404).json({ message: 'No quizzes found for this module' });

    res.status(200).json({ quizzes: quizzesWithQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quiz by ID with questions
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quizRes = await pool.query('SELECT * FROM quizzes WHERE id=$1', [id]);
    if (quizRes.rows.length === 0) return res.status(404).json({ message: 'Quiz not found' });

    const questionsRes = await pool.query('SELECT * FROM questions WHERE quiz_id=$1', [id]);

    res.status(200).json({
      quiz: quizRes.rows[0],
      questions: questionsRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create quiz with questions
const createQuiz = async (req, res) => {
  const { module_id, title, questions } = req.body;

  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  if (!module_id || !title || !questions || !Array.isArray(questions) || questions.length === 0)
    return res.status(400).json({ message: 'Provide module_id, title, and questions' });

  try {
    const quizRes = await pool.query(
      `INSERT INTO quizzes (module_id, title) VALUES ($1, $2) RETURNING *`,
      [module_id, title]
    );
    const quiz = quizRes.rows[0];

    const questionPromises = questions.map(q =>
      pool.query(
        `INSERT INTO questions (quiz_id, question_text, options, correct_answer)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [quiz.id, q.question_text, JSON.stringify(q.options), JSON.stringify(q.correct_answer)]
      )
    );

  await sendNotificationToAllUsers(
    `New quiz available: "${title}"`,
    "quiz",
    req.io
);


    const insertedQuestions = await Promise.all(questionPromises);

    res.status(201).json({
      quiz,
      questions: insertedQuestions.map(q => q.rows[0])
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit quiz and questions
const editQuiz = async (req, res) => {
  try {
    const { id } = req.params; // quiz ID
    const { module_id, title, questions } = req.body;

    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Admins only' });

    // 1️⃣ Update quiz title/module
    const updatedQuizRes = await pool.query(
      `UPDATE quizzes 
       SET module_id = COALESCE($1, module_id), 
           title = COALESCE($2, title), 
           updated_at = NOW() 
       WHERE id = $3 RETURNING *`,
      [module_id, title, id]
    );

    if (updatedQuizRes.rows.length === 0)
      return res.status(404).json({ message: 'Quiz not found' });

    const updatedQuestions = [];

    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        if (q.id) {
  // Existing question → update
  const qRes = await pool.query(
    `UPDATE questions 
     SET question_text = COALESCE($1, question_text),
         options = COALESCE($2::jsonb, options),
         correct_answer = COALESCE($3::jsonb, correct_answer)
     WHERE id = $4
     RETURNING *`,
    [
      q.question_text || null,
      q.options ? JSON.stringify(q.options) : null,
      q.correct_answer ? JSON.stringify(q.correct_answer) : null,
      q.id
    ]
  );
  if (qRes.rows.length) updatedQuestions.push(qRes.rows[0]);
} else {
  // New question → insert
  const qRes = await pool.query(
    `INSERT INTO questions (quiz_id, question_text, options, correct_answer)
     VALUES ($1, $2, $3::jsonb, $4::jsonb) RETURNING *`,
    [id, q.question_text, JSON.stringify(q.options), JSON.stringify(q.correct_answer)]
  );
  updatedQuestions.push(qRes.rows[0]);
}

      }

      // 2️⃣ Delete removed questions safely
      const frontendIds = questions.filter(q => q.id).map(q => q.id);
      if (frontendIds.length > 0) {
        await pool.query(
          `DELETE FROM questions WHERE quiz_id=$1 AND id <> ALL($2::int[])`,
          [id, frontendIds]
        );
      } else {
        // If no questions remain, delete all
        await pool.query(`DELETE FROM questions WHERE quiz_id=$1`, [id]);
      }
    }

    res.status(200).json({
      quiz: updatedQuizRes.rows[0],
      questions: updatedQuestions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Admins only' });

    const deletedQuiz = await pool.query('DELETE FROM quizzes WHERE id=$1 RETURNING *', [id]);
    if (!deletedQuiz.rows.length) return res.status(404).json({ message: 'Quiz not found' });

    res.status(200).json({ message: 'Quiz deleted successfully', quiz: deletedQuiz.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit quiz (unchanged)
const submitQuiz = async (req, res) => {
  try {
    const { quiz_id, answers } = req.body;
    const user_id = req.user.id;

    const quizRes = await pool.query('SELECT * FROM quizzes WHERE id=$1', [quiz_id]);
    if (quizRes.rows.length === 0) return res.status(404).json({ message: 'Quiz not found' });

    const questionsRes = await pool.query('SELECT * FROM questions WHERE quiz_id=$1', [quiz_id]);
    const questions = questionsRes.rows;

    let score = 0;
    answers.forEach(ans => {
      const question = questions.find(q => q.id === ans.question_id);
      const correct = JSON.parse(question.correct_answer);
      if (Array.isArray(ans.selected) && ans.selected.sort().toString() === correct.sort().toString()) {
        score++;
      }
    });

    const xp = score * 10;

    const historyRes = await pool.query(
      `INSERT INTO quizhistory (user_id, quiz_id, score, xp_earned, answers)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, quiz_id, score, xp, JSON.stringify(answers)]
    );

    res.status(201).json({
      message: 'Quiz submitted',
      score,
      xp,
      history: historyRes.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchQuizzes = async (req, res) => {
  try {
    const { q } = req.query; // e.g., /api/quizzes/search?q=math
    if (!q) return res.status(400).json({ message: "Query is required" });

    const result = await pool.query(
      "SELECT * FROM quizzes WHERE LOWER(title) LIKE $1",
      [`%${q.toLowerCase()}%`]
    );

    res.status(200).json({ quizzes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  editQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizzesByModule,
  searchQuizzes
};
