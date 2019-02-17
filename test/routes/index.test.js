/* eslint-disable no-unused-expressions */
import indexController from '../../controllers/indexController';
import indexRouter from '../../routes/index';

describe('IndexRouter', () => {
  it('GET all routes; fallback /*', () => {
    expect(indexRouter.stack).to.have.lengthOf(1);
    expect(indexRouter.stack[0].route.path).to.be.equal('/*');
    expect(indexRouter.stack[0].route.stack[0].method).to.be.equal('get');
    expect(indexRouter.stack[0].route.stack[0].name).to.be.equal('index');
    expect(indexRouter.stack[0].route.stack[0].handle).to.be.equal(indexController);
  });
});
