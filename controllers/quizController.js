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
    if(await isOwner(req.params.quizId, req.user._id) || req.user.level=="moderator" || req.user.level=="admin"){
      const updatedQuiz = await QuizModel.updateQuizById(req.params.quizId, body);
      res.status(200).send({
        payload: updatedQuiz
      });
    } else {
      throw new AppError('Only owner, moderator or admin can update the quiz');
    }
  } catch (error) {
    next(new AppError(error.message));
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

const isOwner = async(quizId, userId) => {
  const quiz = await QuizModel.getQuizById(quizId);
  const ownerId = quiz.ownerId;
  if(userId == ownerId){
    console.log(true);
    return true
  } else {
    console.log(false);
    return false
  }
}



export { getQuizzes, addQuiz, updateQuiz, deleteQuiz };