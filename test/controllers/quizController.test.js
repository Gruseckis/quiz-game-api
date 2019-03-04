/* eslint-disable no-unused-expressions */
import * as QuizModel from '../../models/QuizModel';
import { getQuizzes, addQuiz, updateQuiz, getQuizById, deleteQuiz } from '../../controllers/quizController';
import AppError from '../../errors/AppError';
import * as levelHelper from '../../helpers/accessLevelCheck';

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
  describe('.getQuizById(req, res, next)', () => {
    it('successfully get quiz and return status 200', async () => {
      const req = {
        params: { quizId: 'Quiz Id' },
      };
      const quiz = {};
      const getOneQuizById = sinon.stub(QuizModel, 'getQuizById').resolves(quiz);
      await getQuizById(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(getOneQuizById).to.be.calledOnce;
      expect(getOneQuizById).to.be.calledWith(req.params.quizId);
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { quiz } });
    });
    it('unsuccessfull nothing in database', async () => {
      const req = {
        params: { quizId: 'Quiz Id' },
      };
      const quiz = null;
      const getOneQuizById = sinon.stub(QuizModel, 'getQuizById').resolves(quiz);
      await getQuizById(req, res, next);
      expect(getOneQuizById).to.be.calledOnce;
      expect(next).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
    it('unsuccessfull database error', async () => {
      const req = {
        params: { quizId: 'Quiz Id' },
      };
      const getOneQuizById = sinon.stub(QuizModel, 'getQuizById').rejects();
      await getQuizById(req, res, next);
      expect(getOneQuizById).to.be.calledOnce;
      expect(next).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.updateQuiz(req, res, next)', () => {
    it('successfully update own quiz', async () => {
      const req = {
        params: { quizId: 'Quiz Id' },
        user: { id: 'id' },
        body: { name: 'name', description: 'description' },
      };
      const updatedQuiz = {};
      const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(false);
      const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(true);
      const updateOneQuiz = sinon.stub(QuizModel, 'updateQuizById').resolves(updatedQuiz);
      await updateQuiz(req, res, next);
      expect(levelChecker).to.be.not.calledOnce;
      expect(isOwnerCheck).to.be.calledOnce;
      expect(updateOneQuiz).to.be.calledOnce;
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { quiz: updatedQuiz } });
    });
    it('successfully update if moderator or higher', async () => {
      const req = {
        params: {},
        user: { id: 'id' },
        body: { name: 'name', description: 'description' },
      };
      const updatedQuiz = {};
      const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(true);
      const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(false);
      const updateOneQuiz = sinon.stub(QuizModel, 'updateQuizById').resolves(updatedQuiz);
      await updateQuiz(req, res, next);
      expect(levelChecker).to.be.calledOnce;
      expect(isOwnerCheck).to.be.calledOnce;
      expect(updateOneQuiz).to.be.calledOnce;
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { quiz: updatedQuiz } });
    });
    it('unsuccessfull not moderator or owner', async () => {
      const req = {
        params: {},
        user: { id: 'id' },
        body: { name: 'name', description: 'description' },
      };
      const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(false);
      const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(false);
      const updateOneQuiz = sinon.stub(QuizModel, 'updateQuizById').rejects();
      await updateQuiz(req, res, next);
      expect(isOwnerCheck).to.be.calledOnce;
      expect(levelChecker).to.be.calledOnce;
      expect(updateOneQuiz).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
    it('unsuccessfull database error', async () => {
      const req = {
        params: {},
        user: { id: 'id' },
        body: { name: 'name', description: 'description' },
      };
      const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(true);
      const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(false);
      const updateOneQuiz = sinon.stub(QuizModel, 'updateQuizById').rejects();
      await updateQuiz(req, res, next);
      expect(isOwnerCheck).to.be.calledOnce;
      expect(levelChecker).to.be.calledOnce;
      expect(updateOneQuiz).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
    it('unssuccessfull no quiz in database', async () => {
      const req = {
        params: {},
        user: { id: 'id' },
        body: { name: 'name', description: 'description' },
      };
      const updatedQuiz = null;
      const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(false);
      const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(true);
      const updateOneQuiz = sinon.stub(QuizModel, 'updateQuizById').resolves(updatedQuiz);
      await updateQuiz(req, res, next);
      expect(levelChecker).to.be.not.calledOnce;
      expect(isOwnerCheck).to.be.calledOnce;
      expect(updateOneQuiz).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
    });
  });
  describe('.deleteQuiz(req, res, next)', () => {
    it('successfully delete own quiz', async () => {
      const req = {
        params: { quizId: 'Quiz id' },
        user: { id: 'id' },
      };
      const deletedRecord = {};
      const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(false);
      const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(true);
      const deleteQuizById = sinon.stub(QuizModel, 'deleteQuizById').resolves(deletedRecord);
      await deleteQuiz(req, res, next);
      expect(isOwnerCheck).to.be.calledOnce;
      expect(levelChecker).to.be.not.calledOnce;
      expect(deleteQuizById).to.be.calledOnce;
      expect(deleteQuizById).to.be.calledWith(req.params.quizId);
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { message: 'Successfully deleted quiz' } });
    });
    it('successfully delete if moderator', async () => {
      const req = {
        params: { quizId: 'Quiz id' },
        user: { id: 'id' },
      };
      const deletedRecord = {};
      const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(true);
      const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(false);
      const deleteQuizById = sinon.stub(QuizModel, 'deleteQuizById').resolves(deletedRecord);
      await deleteQuiz(req, res, next);
      expect(isOwnerCheck).to.be.calledOnce;
      expect(levelChecker).to.be.calledOnce;
      expect(deleteQuizById).to.be.calledOnce;
      expect(deleteQuizById).to.be.calledWith(req.params.quizId);
      expect(next).to.be.not.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { message: 'Successfully deleted quiz' } });
    });
  });
  it('unsuccessfull not owner or admin', async () => {
    const req = {
      params: { quizId: 'Quiz id' },
      user: { id: 'id' },
    };
    const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(false);
    const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(false);
    const deleteQuizById = sinon.stub(QuizModel, 'deleteQuizById');
    await deleteQuiz(req, res, next);
    expect(isOwnerCheck).to.be.calledOnce;
    expect(levelChecker).to.be.calledOnce;
    expect(deleteQuizById).to.be.not.calledOnce;
    expect(res.status).to.be.not.calledOnce;
    expect(next).to.be.calledOnce;
    expect(next.args[0][0]).to.be.instanceOf(AppError);
  });
  it('unsuccessfull incorerct quizId', async () => {
    const req = {
      params: { quizId: 'Quiz id' },
      user: { id: 'id' },
    };
    const deletedRecord = null;
    const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(false);
    const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(true);
    const deleteQuizById = sinon.stub(QuizModel, 'deleteQuizById').resolves(deletedRecord);
    await deleteQuiz(req, res, next);
    expect(levelChecker).to.be.not.calledOnce;
    expect(isOwnerCheck).to.be.calledOnce;
    expect(deleteQuizById).to.be.calledOnce;
    expect(res.status).to.be.not.calledOnce;
    expect(next).to.be.calledOnce;
    expect(next.args[0][0]).to.be.instanceOf(AppError);
  });
  it('unsuccessfull database error', async () => {
    const req = {
      params: { quizId: 'Quiz id' },
      user: { id: 'id' },
    };
    const levelChecker = sinon.stub(levelHelper, 'accessLevelCheck').returns(true);
    const isOwnerCheck = sinon.stub(levelHelper, 'isOwner').resolves(true);
    const deleteQuizById = sinon.stub(QuizModel, 'deleteQuizById').rejects();
    await deleteQuiz(req, res, next);
    expect(isOwnerCheck).to.be.calledOnce;
    expect(levelChecker).to.be.not.calledOnce;
    expect(deleteQuizById).to.be.calledOnce;
    expect(res.status).to.be.not.calledOnce;
    expect(next).to.be.calledOnce;
    expect(next.args[0][0]).to.be.instanceOf(AppError);
  });
});
