import express from 'express';
import {
  addNewQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionbyId,
} from '../controllers/questionController';
import { levelCheck } from '../middlewares/levelCheckForQuestions';

const questionRouter = express.Router();

questionRouter.get('', getAllQuestions);
questionRouter.post('', addNewQuestion);
questionRouter.get('/:questionId', getQuestionById);
questionRouter.patch('/:questionId', levelCheck, updateQuestionById);
questionRouter.delete('/:questionId', levelCheck, deleteQuestionbyId);

export default questionRouter;
