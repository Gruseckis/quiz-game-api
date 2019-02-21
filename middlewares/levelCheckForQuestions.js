import * as QuizModel from '../models/QuizModel'
import * as UserModel from '../models/UserModel'
import AppError from '../errors/AppError';

export const levelCheck = async (req, res, next) => {
    try {
        const quiz = await QuizModel.getQuizByQuestionId(req.body.questionId);
        const userLevel = req.user.level;
        const possibleLevels = UserModel.userSchema.obj.level.enum
        const accessLevel = 'quizer'
        const userId = req.user._id;
        const ownerId = quiz.ownerId
        if (possibleLevels.indexOf(userLevel) >= possibleLevels.indexOf(accessLevel) || userId == ownerId) {
            return next();
        } else { throw new AppError("You do not have required level for this operation") }
    } catch (error) {
        next(new AppError(error.message))

    }
}
