/* eslint-disable no-unused-expressions */
import * as resultsController from '../../controllers/resultController';
import resultsRouter from '../../routes/resultRouter';

describe('resultsRouter', () => {
  it('GET getAllResults', () => {
    expect(resultsRouter.stack).to.have.lengthOf(5);
    expect(resultsRouter.stack[0].route.path).to.be.equal('');
    expect(resultsRouter.stack[0].route.stack[0].handle).to.be.equal(resultsController.getAllResults);
    expect(resultsRouter.stack[0].route.stack[0].name).to.be.equal('getAllResults');
    expect(resultsRouter.stack[0].route.stack[0].method).to.be.equal('get');
  });
  it('POST addResults', () => {
    expect(resultsRouter.stack[1].route.path).to.be.equal('');
    expect(resultsRouter.stack[1].route.stack[0].handle).to.be.equal(resultsController.addResults);
    expect(resultsRouter.stack[1].route.stack[0].name).to.be.equal('addResults');
    expect(resultsRouter.stack[1].route.stack[0].method).to.be.equal('post');
  });
  it('GET /:resultId', () => {
    expect(resultsRouter.stack[2].route.path).to.be.equal('/:resultId');
    expect(resultsRouter.stack[2].route.stack[0].handle).to.be.equal(resultsController.getResultById);
    expect(resultsRouter.stack[2].route.stack[0].name).to.be.equal('getResultById');
    expect(resultsRouter.stack[2].route.stack[0].method).to.be.equal('get');
  });
  it('PATCH /:resultId', () => {
    expect(resultsRouter.stack[3].route.path).to.be.equal('/:resultId');
    expect(resultsRouter.stack[3].route.stack[0].handle).to.be.equal(resultsController.updateResultById);
    expect(resultsRouter.stack[3].route.stack[0].name).to.be.equal('updateResultById');
    expect(resultsRouter.stack[3].route.stack[0].method).to.be.equal('patch');
  });
  it('DELETE /:resultId', () => {
    expect(resultsRouter.stack[4].route.path).to.be.equal('/:resultId');
    expect(resultsRouter.stack[4].route.stack[0].handle).to.be.equal(resultsController.deleteResultById);
    expect(resultsRouter.stack[4].route.stack[0].name).to.be.equal('deleteResultById');
    expect(resultsRouter.stack[4].route.stack[0].method).to.be.equal('delete');
  });
});
