import * as QuizModel from '../models/QuizModel';
import AppError from '../errors/AppError';
import { accessLevelCheck } from '../helpers/accessLevelCheck';

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await QuizModel.getAllQuizzes();
    res.status(200).send({ payload: { quizzes } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const addQuiz = async (req, res, next) => {
  const { user } = req;
  try {
    const quiz = await QuizModel.save({
      ownerId: user.id,
      name: req.body.name,
      description: req.body.description,
    });
    res.status(200).send({ payload: { quiz } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updateQuiz = async (req, res, next) => {
  try {
    const body = { ...req.body };
    const checkIfOwner = await isOwner(req.params.quizId, req.user._id);
    if (checkIfOwner || accessLevelCheck(req.user.level, 'moderator')) {
      // TODO: Refator Object keys
      const keys = Object.keys(body);
      let quizUpdate = {};
      let updatedQuiz;

      keys.forEach(key => {
        if (key === 'name' || key === 'description') {
          if (body[key] !== null) {
            quizUpdate[key] = body[key];
          }
        }
      });

      if (Object.keys(quizUpdate).length <= 0) {
        throw new AppError('Nothing to update');
      } else {
        updatedQuiz = await QuizModel.updateQuizById(req.params.quizId, quizUpdate);
      }

      if (!updatedQuiz) {
        throw new AppError('Quiz not found');
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
    const checkIfOwner = await isOwner(req.params.quizId, req.user._id);
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

const isOwner = async (quizId, userId) => {
  try {
    const quiz = await QuizModel.getQuizById(quizId);
    if (!quiz) {
      throw new AppError('Quiz not found');
    }
    const ownerId = quiz.ownerId;
    if (userId.toString() === ownerId.toString()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    new AppError(error.message);
  }
};

export { getQuizzes, addQuiz, updateQuiz, deleteQuiz };
