import {
   save,
   getAllQuestions,
   getQuestionByID,
   getQuestionsFromIdArray,
   updateQuestionByID,
   deleteQuestionByID
} from '../models/questionModel';

import AppError from '../errors/AppError';



const addNewQuestion = async(req, res, next) => {
   try {
      const model = {
         question: req.body.question,
         correct: req.body.correct,
         answers: req.body.answers,
         type: req.body.type
      }
      const question = await save(model);

      res.status(200).send({payload: question})
   } catch(error) {
      next(new AppError(error.message ))
   };
}


const getALLquestions = async(req, res, next) => {
   try {
      const questions = await getAllQuestions();
      res.status(200).send({payload: questions});
   } catch(error) {
      next(new AppError(error.message ))
   };
};


const getQuestionById = async(req, res, next) => {
   try {
      const question = await getQuestionByID(req.params.questionId);
      res.status(200).send({payload: question});
   } catch(error) {
      next(new AppError(error.message ))
   };
};


const updateQuestionById = async(req, res, next) => {
   try {
      const question = await updateQuestionByID(req.params.questionId, {...req.body});
      res.status(200).send({payload: question});
   } catch(error) {
      next(new AppError(error.message ))
   };
};



// should be allow only for quiz owners and admins
const deleteQuestionbyID = async(req, res, next) => {
   try {
      const question = await deleteQuestionByID(req.params.questionId);
      if (question) { res.status(200).send({message: `Question was successfully deleted`}); }
         else {throw new AppError("This questionId doesn't exist")}
   } catch(error) {
      next(new AppError(error.message ))
   };
};


export { addNewQuestion,
         getALLquestions,
         getQuestionById,
         updateQuestionById,
         deleteQuestionbyID
};