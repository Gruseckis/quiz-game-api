import { QuizModel } from '../models/QuizModel'
import { QuestionModel } from '../models/questionModel'
import { RecordModel } from '../models/recordsModel'
import AppError from '../errors/AppError';

const getQuizStatistics = async (req, res, next) => {
	try {
		const result = [];
		const quiz = await QuizModel.findById(req.params.quizId);
		const questions = await QuestionModel.find({_id:{ $in: quiz.questions}});
		const records = await RecordModel.find({questionId: { $in: quiz.questions}});

		questions.forEach(question => {
			const statistics = {};
			statistics.question = question.question;
			const possibleAnswersArray = question.answers;
			const answeredArray = [];
			records.forEach(record => {
						record.answers.forEach(rec => {
								answeredArray.push(rec);
					});
			});
			const answerCount = [];
			possibleAnswersArray.forEach(possibleAnswer => {
					let i = 0;
						answeredArray.forEach(answer => {
							if(parseInt(answer) === possibleAnswersArray.indexOf(possibleAnswer)){
									i++;
							}
					});
						answerCount.push(i);
					i = 0;
			});
			statistics.answers = answerCount;
			const correctAnswersArray = [];
			question.correct.forEach(answer =>{
					correctAnswersArray.push(parseInt(answer));
			})
			statistics.correct = correctAnswersArray;
			statistics.respondees = records.length;
			result.push(statistics);

		})
		res.status(200).send({ payload: result });

	} catch(error) {
		next(new AppError(error.message));
	}
};

export { getQuizStatistics };
