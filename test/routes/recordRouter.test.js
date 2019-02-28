/* eslint-disable no-unused-expressions */
import * as recordsController from '../../controllers/recordsController';
import recordsRouter from '../../routes/recordRouter';

describe('recordsRouter', () => {
  it('GET getAllRecords', () => {
    expect(recordsRouter.stack).to.have.lengthOf(5);
    expect(recordsRouter.stack[0].route.path).to.be.equal('');
    expect(recordsRouter.stack[0].route.stack[0].handle).to.be.equal(recordsController.getAllRecords);
    expect(recordsRouter.stack[0].route.stack[0].name).to.be.equal('getAllRecords');
    expect(recordsRouter.stack[0].route.stack[0].method).to.be.equal('get');
  });
  it('POST addRecord', () => {
    expect(recordsRouter.stack[1].route.path).to.be.equal('');
    expect(recordsRouter.stack[1].route.stack[0].handle).to.be.equal(recordsController.addRecord);
    expect(recordsRouter.stack[1].route.stack[0].name).to.be.equal('addRecord');
    expect(recordsRouter.stack[1].route.stack[0].method).to.be.equal('post');
  });
  it('GET /:recordId', () => {
    expect(recordsRouter.stack[2].route.path).to.be.equal('/:recordId');
    expect(recordsRouter.stack[2].route.stack[0].handle).to.be.equal(recordsController.getRecordById);
    expect(recordsRouter.stack[2].route.stack[0].name).to.be.equal('getRecordById');
    expect(recordsRouter.stack[2].route.stack[0].method).to.be.equal('get');
  });
  it('PATCH /:recordId', () => {
    expect(recordsRouter.stack[3].route.path).to.be.equal('/:recordId');
    expect(recordsRouter.stack[3].route.stack[0].handle).to.be.equal(recordsController.updateRecordById);
    expect(recordsRouter.stack[3].route.stack[0].name).to.be.equal('updateRecordById');
    expect(recordsRouter.stack[3].route.stack[0].method).to.be.equal('patch');
  });
  it('DELETE /:recordId', () => {
    expect(recordsRouter.stack[4].route.path).to.be.equal('/:recordId');
    expect(recordsRouter.stack[4].route.stack[0].handle).to.be.equal(recordsController.deleteRecordById);
    expect(recordsRouter.stack[4].route.stack[0].name).to.be.equal('deleteRecordById');
    expect(recordsRouter.stack[4].route.stack[0].method).to.be.equal('delete');
  });
});
