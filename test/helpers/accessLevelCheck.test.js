import { isOwner } from '../../helpers/accessLevelCheck';
import * as QuizModel from '../../models/QuizModel';
import AppError from '../../errors/AppError';

describe('AccessLevelCheck', () => {
  describe('.isOwner(quizId, userId)', () => {
    const userId = 'id';
    const quizId = 'quizID';
    afterEach(() => {
      sinon.restore();
    });
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
