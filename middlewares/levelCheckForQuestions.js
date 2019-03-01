import * as QuizModel from '../models/QuizModel';
import * as UserModel from '../models/UserModel';
import AppError from '../errors/AppError';

export const levelCheck = async (req, res, next) => {
  try {
    const quiz = await QuizModel.getQuizByQuestionId(req.params.questionId);
    if (!quiz) {
      throw new AppError('This question is not a part of any quiz');
    }
    const possibleLevels = UserModel.userSchema.obj.level.enum;
    const userId = req.user._id;
    const ownerId = quiz[0].ownerId;
    if (
      possibleLevels.indexOf(req.user.level) >= possibleLevels.indexOf(process.env.ACCESS_LEVEL) ||
      userId === ownerId
    ) {
      return next();
    } else {
      throw new AppError('You do not have required level for this operation');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};
