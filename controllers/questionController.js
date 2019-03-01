import * as questionModel from '../models/questionModel';
import AppError from '../errors/AppError';
import { QuizModel, getQuizById } from '../models/QuizModel';

const addNewQuestion = async (req, res, next) => {
  try {
    const quizValidation = await getQuizById(req.body.quizId);
    if (quizValidation) {
      const question = await questionModel.save({
        question: req.body.question,
        correct: req.body.correct,
        answers: req.body.answers,
        type: req.body.type,
      });
      await QuizModel.findByIdAndUpdate(req.body.quizId, { $push: { questions: question.id } });
      res.status(200).send({ payload: { question } });
      return;
    }
    throw new AppError('Please provide a valid quiz ID');
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getALLquestions = async (req, res, next) => {
  try {
    const questions = await questionModel.getAllQuestions();
    res.status(200).send({ payload: { questions } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const question = await questionModel.getQuestionByID(req.params.questionId);
    res.status(200).send({ payload: { question } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updateQuestionById = async (req, res, next) => {
  try {
    const question = await questionModel.updateQuestionById(req.params.questionId, { ...req.body });
    res.status(200).send({ payload: { question } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteQuestionbyId = async (req, res, next) => {
  try {
    const question = await questionModel.deleteQuestionById(req.params.questionId);
    if (question) {
      res.status(200).send({ payload: { message: `Question was successfully deleted` } });
    } else {
      throw new AppError("This questionId doesn't exist");
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

export { addNewQuestion, getALLquestions, getQuestionById, updateQuestionById, deleteQuestionbyId };
