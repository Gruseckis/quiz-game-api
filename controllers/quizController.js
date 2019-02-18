import * as QuizModel from '../models/QuizModel';
import AppError from '../errors/AppError';

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await QuizModel.getAllQuizzes();
    res.status(200).send({ payload: { quizzes } })
  } catch (error) {
    next(new AppError(error.message));
  }
}

// const addQuiz = async (req, res, next) => {
//   const { user } = req;
//   try {

//   } catch (error) {
//     next(new AppError(error.message));
//   }
// }

export { getQuizzes };