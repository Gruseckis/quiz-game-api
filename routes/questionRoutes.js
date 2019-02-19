import express from 'express';

import { addNewQuestion,
         getQuestions,
         getALLquestions,
         getQuestionById,
         getQuestionsfromIDs,
         updateQuestionById,
         deleteQuestionbyID
} from '../controllers/questionController';

const questionRouter = express.Router();

questionRouter.get('/', getALLquestions );
questionRouter.post('/', addNewQuestion);
questionRouter.get('/:questionId', getQuestionById);
questionRouter.patch('/:questionId', updateQuestionById);
// this router must check if user has permission(quizowner or admin)
questionRouter.delete('/:questionId', deleteQuestionbyID )



export default questionRouter;