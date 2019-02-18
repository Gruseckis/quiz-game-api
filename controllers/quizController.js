import * as QuizModel from '../models/QuizModel';
import AppError from '../errors/AppError';

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await QuizModel.getAllQuizzes();
    res.status(200).send({
      payload: { quizzes }
    })
  } catch (error) {
    next(new AppError(error.message));
  }
}

const addQuiz = async (req, res, next) => {
  try {
    const quiz = await QuizModel.save({
      ownerId: req.body.userId,
      name: req.body.name,
      description: req.body.description
    });
    res.status(200).send({
      payload: quiz
    });
  } catch (error) {
    next(new AppError(error.message));
  }
}

const updateQuiz = async (req, res, next) => {
  try {
    const body = { ...req.body };
    const updatedQuiz = await QuizModel.updateQuizById(req.params.quizId, body);
    res.status(200).send({
      payload: updatedQuiz
    });
  } catch (error) {
    next(new AppError(error.message));
  }
}

const deleteQuiz = async (req, res, next) => {
  try {
    await QuizModel.deleteQuizById(req.params.quizId);
    res.status(200).send({
      payload: {
        message: 'Successfully deleted quiz'
      }
    });
  } catch (error) {
    next(new AppError(error.message));
  }
}

export { getQuizzes, addQuiz, updateQuiz, deleteQuiz };