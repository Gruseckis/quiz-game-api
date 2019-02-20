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
  const { user } = req;
  try {
    const quiz = await QuizModel.save({
      ownerId: user.id,
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
    const keysLength = Object.keys(body).length;
    let updatedQuiz = {};

    if (keysLength < 1 || keysLength > 2) {
      throw new AppError('Invalid properties defined');
    } else if (keysLength === 2) {
      if (body.hasOwnProperty('name') && body.hasOwnProperty('description')) {
        updatedQuiz = await QuizModel.updateQuizById(req.params.quizId, body);
      } else {
        throw new AppError('Invalid properties defined');
      }
    } else {
      if (body.hasOwnProperty('name') || body.hasOwnProperty('description')) {
        updatedQuiz = await QuizModel.updateQuizById(req.params.quizId, body);
      } else {
        throw new AppError('Invalid properties defined');
      }
    }

    res.status(200).send({
      payload: updatedQuiz
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message));
  }
}

const deleteQuiz = async (req, res, next) => {
  try {
    const result = await QuizModel.deleteQuizById(req.params.quizId);
    console.log(result);
    if (!result) {
      throw new AppError('Cannot delete quiz which does not exist');
    }
    res.status(200).send({
      payload: {
        message: 'Successfully deleted quiz'
      }
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message));
  }
}

export { getQuizzes, addQuiz, updateQuiz, deleteQuiz };