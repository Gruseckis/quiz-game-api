import express from 'express';
import { addNewQuestion, getALLquestions, getQuestionById, updateQuestionById, deleteQuestionbyID } from '../controllers/questionController';
import { levelCheck } from '../middlewares/levelCheckForQuestions'

const questionRouter = express.Router();

questionRouter.get('/', getALLquestions);
questionRouter.post('/', addNewQuestion);
questionRouter.get('/:questionId', getQuestionById);
questionRouter.patch('/:questionId', levelCheck, updateQuestionById);
questionRouter.delete('/:questionId', levelCheck, deleteQuestionbyID)

export default questionRouter;