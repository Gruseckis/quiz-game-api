import AppError from '../errors/AppError';
import * as QuizModel from '../models/QuizModel';

function accessLevelCheck(userLevel, accessLevel) {
  const levels = ['user', 'quizer', 'moderator', 'admin'];
  if (levels.indexOf(userLevel) >= levels.indexOf(accessLevel)) {
    return true;
  } else {
    return false;
  }
}

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
    return new AppError(error.message);
  }
};

export { accessLevelCheck, isOwner };
