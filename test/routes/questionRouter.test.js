/* eslint-disable no-unused-expressions */
import * as questionController from '../../controllers/questionController';
import { levelCheck } from '../../middlewares/levelCheckForQuestions';
import questionRouter from '../../routes/questionRouter';

describe('QuestionRouter', () => {
  it('GET getaAllQuestion', () => {
    expect(questionRouter.stack).to.have.lengthOf(5);
    expect(questionRouter.stack[0].route.path).to.be.equal('');
    expect(questionRouter.stack[0].route.stack[0].handle).to.be.equal(questionController.getAllQuestions);
    expect(questionRouter.stack[0].route.stack[0].name).to.be.equal('getAllQuestions');
    expect(questionRouter.stack[0].route.stack[0].method).to.be.equal('get');
  });
  it('POST addNewQuestion', () => {
    expect(questionRouter.stack[1].route.path).to.be.equal('');
    expect(questionRouter.stack[1].route.stack[0].handle).to.be.equal(questionController.addNewQuestion);
    expect(questionRouter.stack[1].route.stack[0].name).to.be.equal('addNewQuestion');
    expect(questionRouter.stack[1].route.stack[0].method).to.be.equal('post');
  });
  it('GET /:questionId', () => {
    expect(questionRouter.stack[2].route.path).to.be.equal('/:questionId');
    expect(questionRouter.stack[2].route.stack[0].handle).to.be.equal(questionController.getQuestionById);
    expect(questionRouter.stack[2].route.stack[0].name).to.be.equal('getQuestionById');
    expect(questionRouter.stack[2].route.stack[0].method).to.be.equal('get');
  });
  it('PATCH /:questionId', () => {
    expect(questionRouter.stack[3].route.path).to.be.equal('/:questionId');
    expect(questionRouter.stack[3].route.stack[0].handle).to.be.equal(levelCheck);
    expect(questionRouter.stack[3].route.stack[0].name).to.be.equal('levelCheck');
    expect(questionRouter.stack[3].route.stack[0].method).to.be.equal('patch');
    expect(questionRouter.stack[3].route.stack[1].handle).to.be.equal(questionController.updateQuestionById);
    expect(questionRouter.stack[3].route.stack[1].name).to.be.equal('updateQuestionById');
    expect(questionRouter.stack[3].route.stack[1].method).to.be.equal('patch');
  });
  it('DELETE /:questionId', () => {
    expect(questionRouter.stack[4].route.path).to.be.equal('/:questionId');
    expect(questionRouter.stack[4].route.stack[0].handle).to.be.equal(levelCheck);
    expect(questionRouter.stack[4].route.stack[0].name).to.be.equal('levelCheck');
    expect(questionRouter.stack[4].route.stack[0].method).to.be.equal('delete');
    expect(questionRouter.stack[4].route.stack[1].handle).to.be.equal(questionController.deleteQuestionbyId);
    expect(questionRouter.stack[4].route.stack[1].name).to.be.equal('deleteQuestionbyId');
    expect(questionRouter.stack[4].route.stack[1].method).to.be.equal('delete');
  });
});
