import {save, getAllQuestions, getQuestionByID, updateQuestionByID, deleteQuestionByID} from '../models/questionModel';
import AppError from '../errors/AppError';
import { QuizModel, updateQuizById, getAllQuizzes, findQuizByQuestionId  } from '../models/QuizModel';
import { type } from 'os';



const addNewQuestion = async(req, res, next) => {
   try {
      const question = await save({
         question: req.body.question,
         correct: req.body.correct,
         answers: req.body.answers,
         type: req.body.type
      });
      
      await QuizModel.findByIdAndUpdate(req.body.quizId, {$push:{questions: question.id}} );
      
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

const deleteQuestionbyID = async(req, res, next) => {
   try {
      let targetQuiz = await findQuizByQuestionId({questions:{$in:[req.params.questionId]}});
      targetQuiz = targetQuiz[0];
      targetQuiz.questions.splice(targetQuiz.questions.indexOf(req.params.questionId),1);
      await QuizModel(targetQuiz).save();
      const question = await deleteQuestionByID(req.params.questionId);
      if (question) 
         {res.status(200).send({message: `Question was successfully deleted`}); }
      else 
         {throw new AppError("This questionId doesn't exist")}
   } catch(error) {
      next(new AppError(error.message ))
   };
};

export { addNewQuestion, getALLquestions, getQuestionById, updateQuestionById, deleteQuestionbyID };