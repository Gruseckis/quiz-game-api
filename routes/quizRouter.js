import express from 'express';

import * as quizController from '../controllers/quizController';

const router = express.Router();

router.get('', quizController.getQuizzes);
router.post('', quizController.addQuiz);
router.patch('/:quizId', quizController.updateQuiz);
router.delete('/:quizId', quizController.deleteQuiz);

export default router;
