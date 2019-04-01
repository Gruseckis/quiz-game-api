/* eslint-disable no-unused-expressions */
import {
  getAllResults,
  getResultById,
  addResults,
  deleteResultById,
  updateResultById,
} from '../../controllers/resultController';
import * as ResultModel from '../../models/resultModel';
import * as RecordModel from '../../models/recordsModel';
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
    it('unsuccessfull database error', async () => {
      const req = {
        body: {},
        user: {},
      };
      const saveResult = sinon.stub(ResultModel, 'save').rejects();
      await addResults(req, res, next);
      expect(saveResult).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.deleteResultById(req, res, next)', () => {
    it('successfully delete result', async () => {
      const req = {
        params: { resultId: 'resultId' },
      };
      const deletedResult = { recordIds: ['id1', 'id2'] };
      const deleteResult = sinon.stub(ResultModel, 'deleteResultById').resolves(deletedResult);
      const deleteRecords = sinon.stub(RecordModel, 'deleteRecordsFromIdArray').resolves();
      await deleteResultById(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(deleteResult).to.be.calledOnce;
      expect(deleteResult).to.be.calledWith(req.params.resultId);
      expect(deleteRecords).to.be.calledOnce;
      expect(deleteRecords).to.be.calledWith(deletedResult.recordIds);
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { message: 'Result is deleted' } });
    });
    it('unsuccessfull no result in DB', async () => {
      const req = {
        params: { resultId: 'resultId' },
      };
      const deletedResult = null;
      const deleteResult = sinon.stub(ResultModel, 'deleteResultById').resolves(deletedResult);
      const deleteRecords = sinon.stub(RecordModel, 'deleteRecordsFromIdArray').resolves();
      await deleteResultById(req, res, next);
      expect(deleteResult).to.be.calledOnce;
      expect(deleteRecords).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
    it('unsuccessfull database error', async () => {
      const req = {
        params: { resultId: 'resultId' },
      };
      const deleteResult = sinon.stub(ResultModel, 'deleteResultById').rejects();
      const deleteRecords = sinon.stub(RecordModel, 'deleteRecordsFromIdArray').resolves();
      await deleteResultById(req, res, next);
      expect(deleteResult).to.be.calledOnce;
      expect(deleteRecords).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.updateResultById(req, res, next)', () => {
    it('successfully update result', async () => {
      const req = {
        params: {
          resultId: 'resultId',
        },
        body: {
          recordIds: ['id2', 'id3'],
        },
      };
      const updatedResult = {};
      const updateResult = sinon.stub(ResultModel, 'findByIdAndUpdate').resolves(updatedResult);
      await updateResultById(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(updateResult).to.be.calledOnce;
      expect(updateResult).to.be.calledWith({ id: req.params.resultId, model: { recordIds: req.body.recordIds } });
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { result: updatedResult } });
    });
    it('unsuccessfull nothing to update', async () => {
      const req = {
        params: {
          resultId: 'resultId',
        },
        body: {
          recordIds: [],
        },
      };
      const updateResult = sinon.stub(ResultModel, 'findByIdAndUpdate').resolves();
      await updateResultById(req, res, next);
      expect(updateResult).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
    it('unsuccessfull database error', async () => {
      const req = {
        params: {
          resultId: 'resultId',
        },
        body: {
          recordIds: ['id'],
        },
      };
      const updateResult = sinon.stub(ResultModel, 'findByIdAndUpdate').rejects();
      await updateResultById(req, res, next);
      expect(updateResult).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
});
