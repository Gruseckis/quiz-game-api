/* eslint-disable no-unused-expressions */
import { getAllResults, getResultById, addResults } from '../../controllers/resultController';
import * as ResultModel from '../../models/resultModel';
import AppError from '../../errors/AppError';

describe('ResultController', () => {
  let resSend, res, next;
  beforeEach(() => {
    resSend = { send: sinon.stub() };
    res = { status: sinon.stub().returns(resSend) };
    next = sinon.stub();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('.getAllResults(req, res, next)', () => {
    const req = {};
    it('succesfully returns results', async () => {
      const results = [];
      const getAllResultsFromDb = sinon.stub(ResultModel, 'getAllResults').resolves(results);
      await getAllResults(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(getAllResultsFromDb).to.be.calledOnce;
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { results: results || [] } });
    });
    it('unsuccessfull database error', async () => {
      const getAllResultsFromDb = sinon.stub(ResultModel, 'getAllResults').rejects();
      await getAllResults(req, res, next);
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(getAllResultsFromDb).to.be.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.getResultById(req, res, next)', () => {
    it('successfully return reslt by id', async () => {
      const req = {
        params: {
          resultId: 'resultId',
        },
      };
      const result = {};
      const getResultByIdFromDb = sinon.stub(ResultModel, 'getResultById').resolves(result);
      await getResultById(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(getResultByIdFromDb).to.be.calledOnce;
      expect(getResultByIdFromDb).to.be.calledWith(req.params.resultId);
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { result } });
    });
    it('throws up error when no resultId provided', async () => {
      const req = {
        params: {},
      };
      const getResultByIdFromDb = sinon.stub(ResultModel, 'getResultById').rejects();
      await getResultById(req, res, next);
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(getResultByIdFromDb).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
    it('unsuccessful database error', async () => {
      const req = {
        params: {
          resultId: 'resultId',
        },
      };
      const getResultByIdFromDb = sinon.stub(ResultModel, 'getResultById').rejects();
      await getResultById(req, res, next);
      expect(getResultByIdFromDb).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.addResults(req, res, next)', () => {
    it('successfully add result', async () => {
      const req = {
        body: {
          quizId: 'quizId',
        },
        user: {
          _id: 'id',
        },
      };
      const result = {};
      const saveResult = sinon.stub(ResultModel, 'save').resolves(result);
      await addResults(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(saveResult).to.be.calledOnce;
      expect(saveResult).to.be.calledWith({
        quizId: req.body.quizId,
        userId: req.user._id,
      });
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { result } });
    });
  });
});
