/* eslint-disable no-unused-expressions */
import * as QuizModel from '../../models/QuizModel';
import { getQuizzes, addQuiz, isOwner } from '../../controllers/quizController';
import AppError from '../../errors/AppError';

describe('QuizController', () => {
  let resSend, res, next;
  beforeEach(() => {
    resSend = { send: sinon.stub() };
    res = { status: sinon.stub().returns(resSend) };
    next = sinon.stub();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('.getQuizzes(req, res, next)', () => {
    it('return quizzes and status 200 on success', async () => {
      const req = {};
      const quizzes = [];
      const getAllQuizzesFromDb = sinon.stub(QuizModel, 'getAllQuizzes').resolves(quizzes);
      await getQuizzes(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(getAllQuizzesFromDb).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { quizzes } });
    });
    it('unsuccessfull request, database error', async () => {
      const req = {};
      const getAllQuizzesFromDb = sinon.stub(QuizModel, 'getAllQuizzes').rejects();
      await getQuizzes(req, res, next);
      expect(getAllQuizzesFromDb).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.addQuiz(req, res, next)', () => {
    it('successfull request, return created quiz and status 201', async () => {
      const req = {
        user: {
          id: 'userId',
        },
        body: {
          name: 'Quiz name',
          description: 'Quiz description',
        },
      };
      const quiz = {};
      const saveQuiz = sinon.stub(QuizModel, 'save').resolves(quiz);
      await addQuiz(req, res, next);
      expect(saveQuiz).to.be.calledOnce;
      expect(saveQuiz).to.be.calledWith({
        ownerId: req.user.id,
        name: req.body.name,
        description: req.body.description,
      });
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledWith(201);
      expect(resSend.send).to.be.calledWith({ payload: { quiz } });
    });
    it('unsuccessfull request, database error', async () => {
      const saveQuiz = sinon.stub(QuizModel, 'save').rejects();
      const req = { user: { id: '' }, body: { name: '', description: '' } };
      await addQuiz(req, res, next);
      expect(saveQuiz).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.updateQuiz(req, res, next)', () => {
    it('successfully update own quiz', async () => {});
  });
  describe('.isOwner(quizId, userId)', () => {
    const userId = 'id';
    const quizId = 'quizID';
    it('return true if owner', async () => {
      const quiz = { ownerId: 'id' };
      const getQuizById = sinon.stub(QuizModel, 'getQuizById').resolves(quiz);
      const isOwnerTrue = await isOwner(quizId, userId);
      expect(getQuizById).to.be.calledOnce;
      expect(isOwnerTrue).to.be.equal(true);
    });
    it('returns false if not owner', async () => {
      const quiz = { ownerId: 'notSameId' };
      const getQuizById = sinon.stub(QuizModel, 'getQuizById').resolves(quiz);
      const isOwnerFalse = await isOwner(quizId, userId);
      expect(getQuizById).to.be.calledOnce;
      expect(isOwnerFalse).to.be.equal(false);
    });
    it('returns error when get database error', async () => {
      const error = { name: 'database error' };
      const getQuizById = sinon.stub(QuizModel, 'getQuizById').rejects(error);
      const isOwnerError = await isOwner(quizId, userId);
      expect(getQuizById).to.be.calledOnce;
      expect(isOwnerError).to.be.instanceOf(AppError);
      expect(isOwnerError.status).to.be.equal(500);
    });
    it('returns error if no quiz is in database', async () => {
      const quiz = null;
      const getQuizById = sinon.stub(QuizModel, 'getQuizById').resolves(quiz);
      const isOwnerError = await isOwner(quizId, userId);
      expect(getQuizById).to.be.calledOnce;
      expect(isOwnerError).to.be.instanceOf(AppError);
    });
  });
});
