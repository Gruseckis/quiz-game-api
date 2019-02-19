import express from 'express';
import { addNewQuestion, getALLquestions, getQuestionById, updateQuestionById, deleteQuestionbyID } from '../controllers/questionController';

const questionRouter = express.Router();

questionRouter.get('/', getALLquestions );
questionRouter.post('/', addNewQuestion);
questionRouter.get('/:questionId', getQuestionById);
questionRouter.patch('/:questionId', updateQuestionById);
questionRouter.delete('/:questionId', deleteQuestionbyID )

export default questionRouter;