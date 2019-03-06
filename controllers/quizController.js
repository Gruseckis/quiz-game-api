import * as QuizModel from '../models/QuizModel';
import AppError from '../errors/AppError';
import { accessLevelCheck, isOwner } from '../helpers/accessLevelCheck';

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await QuizModel.getAllQuizzes();
    res.status(200).send({ payload: { quizzes } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const addQuiz = async (req, res, next) => {
  try {
    const { user } = req;
    if (accessLevelCheck(req.user.level, 'quizer')) {
      const quiz = await QuizModel.save({
        ownerId: user.id,
        name: req.body.name,
        description: req.body.description,
      });
      res.status(201).send({ payload: { quiz } });
    } else {
      throw new AppError('You need to be a quizer or higher level to be able to create quiz');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await QuizModel.getQuizById(req.params.quizId);
    if (!quiz) {
      throw new AppError('Quiz with such ID does not exists');
    }
    res.status(200).send({ payload: { quiz } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const checkIfOwner = await isOwner(req.params.quizId, req.user.id);
    if (checkIfOwner || accessLevelCheck(req.user.level, 'moderator')) {
      const { name, description } = req.body;
      let quizUpdate = {};

      name ? (quizUpdate.name = name) : null;
      description ? (quizUpdate.description = description) : null;

      const updatedQuiz = await QuizModel.updateQuizById(req.params.quizId, quizUpdate);

      if (!updatedQuiz) {
        throw new AppError('No quiz found in database');
      }
      res.status(200).send({ payload: { quiz: updatedQuiz } });
    } else {
      throw new AppError('Only owner, moderator or admin can update the quiz');
    }
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message));
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const checkIfOwner = await isOwner(req.params.quizId, req.user.id);
    if (checkIfOwner || accessLevelCheck(req.user.level, 'moderator')) {
      const result = await QuizModel.deleteQuizById(req.params.quizId);
      if (!result) {
        throw new AppError('Cannot delete quiz which does not exist');
      }
      res.status(200).send({ payload: { message: 'Successfully deleted quiz' } });
    } else {
      throw new AppError('Only owner, moderator or admin can delete the quiz');
    }
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message));
  }
};

export { getQuizzes, addQuiz, updateQuiz, deleteQuiz, getQuizById };
