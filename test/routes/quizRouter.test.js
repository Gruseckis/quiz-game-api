/* eslint-disable no-unused-expressions */
import * as quizController from '../../controllers/quizController';
import quizRouter from '../../routes/quizRouter';

describe('quizRouter', () => {
  it('GET getQuizzes', () => {
    expect(quizRouter.stack).to.have.lengthOf(5);
    expect(quizRouter.stack[0].route.path).to.be.equal('');
    expect(quizRouter.stack[0].route.stack[0].handle).to.be.equal(quizController.getQuizzes);
    expect(quizRouter.stack[0].route.stack[0].name).to.be.equal('getQuizzes');
    expect(quizRouter.stack[0].route.stack[0].method).to.be.equal('get');
  });
  it('POST addQuiz', () => {
    expect(quizRouter.stack[1].route.path).to.be.equal('');
    expect(quizRouter.stack[1].route.stack[0].handle).to.be.equal(quizController.addQuiz);
    expect(quizRouter.stack[1].route.stack[0].name).to.be.equal('addQuiz');
    expect(quizRouter.stack[1].route.stack[0].method).to.be.equal('post');
  });
  it('GET /:quizId', () => {
    expect(quizRouter.stack[2].route.path).to.be.equal('/:quizId');
    expect(quizRouter.stack[2].route.stack[0].handle).to.be.equal(quizController.getQuizById);
    expect(quizRouter.stack[2].route.stack[0].name).to.be.equal('getQuizById');
    expect(quizRouter.stack[2].route.stack[0].method).to.be.equal('get');
  });
  it('PATCH /:quizId', () => {
    expect(quizRouter.stack[3].route.path).to.be.equal('/:quizId');
    expect(quizRouter.stack[3].route.stack[0].handle).to.be.equal(quizController.updateQuiz);
    expect(quizRouter.stack[3].route.stack[0].name).to.be.equal('updateQuiz');
    expect(quizRouter.stack[3].route.stack[0].method).to.be.equal('patch');
  });
  it('DELETE /:quizId', () => {
    expect(quizRouter.stack[4].route.path).to.be.equal('/:quizId');
    expect(quizRouter.stack[4].route.stack[0].handle).to.be.equal(quizController.deleteQuiz);
    expect(quizRouter.stack[4].route.stack[0].name).to.be.equal('deleteQuiz');
    expect(quizRouter.stack[4].route.stack[0].method).to.be.equal('delete');
  });
});
