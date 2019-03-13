/* eslint-disable no-unused-expressions */
import * as QuestionModel from '../../models/questionModel';
import * as QuizModel from '../../models/QuizModel';
import {
  addNewQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionbyId,
} from '../../controllers/questionController';
import AppError from '../../errors/AppError';
import * as levelHelper from '../../helpers/accessLevelCheck';

describe('QuestionController', () => {
  let resSend, res, next;
  beforeEach(() => {
    resSend = { send: sinon.stub() };
    res = { status: sinon.stub().returns(resSend) };
    next = sinon.stub();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('.addNewQuestion(req, res, next)', () => {
    let req;
    beforeEach(() => {
      req = {
        body: {
          question: 'question',
          correct: 'correct',
          answers: 'answers',
          type: 'type',
          quizId: 'id',
        },
      };
    });
    it('Saves question and adds it id to quiz, return 200', async () => {
      const quiz = {};
      const question = { id: 'questionId' };
      const quizCheck = sinon.stub(QuizModel, 'getQuizById').resolves(quiz);
      const saveQuiz = sinon.stub(QuestionModel, 'save').resolves(question);
      const updateQUiz = sinon.stub(QuizModel, 'addQuestionIntoQuiz').resolves();
      await addNewQuestion(req, res, next);
      expect(quizCheck).to.be.calledOnce;
      expect(quizCheck).to.be.calledWith(req.body.quizId);
      expect(saveQuiz).to.be.calledOnce;
      expect(saveQuiz).to.be.calledWith({
        question: req.body.question,
        correct: req.body.correct,
        answers: req.body.answers,
        type: req.body.type,
      });
      expect(updateQUiz).to.be.calledOnce;
      expect(updateQUiz).to.be.calledWith(req.body.quizId, question.id);
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { question } });
      expect(next).to.be.not.calledOnce;
    });
    it('unsuccessfull no quiz found return error', async () => {
      const quiz = null;
      const quizCheck = sinon.stub(QuizModel, 'getQuizById').resolves(quiz);
      const saveQuiz = sinon.stub(QuestionModel, 'save').resolves();
      const updateQUiz = sinon.stub(QuizModel, 'addQuestionIntoQuiz').resolves();
      await addNewQuestion(req, res, next);
      expect(quizCheck).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(saveQuiz).to.be.not.calledOnce;
      expect(updateQUiz).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
    it('unsuccessfull database error', async () => {
      const quizCheck = sinon.stub(QuizModel, 'getQuizById').rejects();
      const saveQuiz = sinon.stub(QuestionModel, 'save').resolves();
      const updateQUiz = sinon.stub(QuizModel, 'addQuestionIntoQuiz').resolves();
      await addNewQuestion(req, res, next);
      expect(quizCheck).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(saveQuiz).to.be.not.calledOnce;
      expect(updateQUiz).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
  });
  describe('.addNewQuestion(req, res, next)', () => {
    const req = {};
    it('Returns all questions with code 200', async () => {
      const questions = [];
      const getAllQuestionFromdb = sinon.stub(QuestionModel, 'getAllQuestions').resolves(questions);
      await getAllQuestions(req, res, next);
      expect(getAllQuestionFromdb).to.be.calledOnce;
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { questions } });
    });
    it('Unsuccessfull, database error return', async () => {
      const getAllQuestionFromdb = sinon.stub(QuestionModel, 'getAllQuestions').rejects();
      await getAllQuestions(req, res, next);
      expect(getAllQuestionFromdb).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
  });
  describe('.getQuestionById(req, res, next)', () => {
    const req = {
      params: {
        questionId: 'questionId',
      },
    };
    it('Successfull return question, status 200', async () => {
      const question = {};
      const getQuestionByIdFromdb = sinon.stub(QuestionModel, 'getQuestionByID').resolves(question);
      await getQuestionById(req, res, next);
      expect(getQuestionByIdFromdb).to.be.calledOnce;
      expect(getQuestionByIdFromdb).to.be.calledWith(req.params.questionId);
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { question } });
    });
    it('Unseccessfull database error', async () => {
      const getQuestionByIdFromdb = sinon.stub(QuestionModel, 'getQuestionByID').rejects();
      await getQuestionById(req, res, next);
      expect(getQuestionByIdFromdb).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
  });
  describe('.updateQuestionById(req, res, next)', () => {
    const req = {
      params: {
        questionId: 'questionId',
      },
      body: {},
    };
    it('Successfull request, updated question, status 200', async () => {
      const newQuestion = {};
      const updateQuestion = sinon.stub(QuestionModel, 'updateQuestionById').resolves(newQuestion);
      await updateQuestionById(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(updateQuestion).to.be.calledWith;
      expect(updateQuestion).to.be.calledWith(req.params.questionId, req.body);
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { question: newQuestion } });
    });
    it('Unsuccessfull request, database error, return error', async () => {
      const updateQuestion = sinon.stub(QuestionModel, 'updateQuestionById').rejects();
      await updateQuestionById(req, res, next);
      expect(updateQuestion).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
  });
  describe('.deleteQuestionbyId(req, res, next)', () => {
    const req = {
      params: {
        questionId: 'questionId',
      },
    };
    it('Successfully deleted question, return 200', async () => {
      const deletedQuestion = {};
      const deleteQuestion = sinon.stub(QuestionModel, 'deleteQuestionById').resolves(deletedQuestion);
      await deleteQuestionbyId(req, res, next);
      expect(deleteQuestion).to.be.calledOnce;
      expect(deleteQuestion).to.be.calledWith(req.params.questionId);
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { message: `Question was successfully deleted` } });
    });
    it('Unsuccessfull, no question in database, return error', async () => {
      const deleteQuestion = sinon.stub(QuestionModel, 'deleteQuestionById').resolves(null);
      await deleteQuestionbyId(req, res, next);
      expect(deleteQuestion).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
    it('Unsuccessfull, database error, return error', async () => {
      const deleteQuestion = sinon.stub(QuestionModel, 'deleteQuestionById').rejects();
      await deleteQuestionbyId(req, res, next);
      expect(deleteQuestion).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
  });
});
