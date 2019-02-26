/* eslint-disable no-unused-expressions */
import { diskStorageSingle } from '../../middlewares/diskStorage';
import * as mediaController from '../../controllers/mediaController';
import mediaRouter from '../../routes/mediaRouter';

describe('MediaRouter', () => {
  it('POST addMedia', () => {
    expect(mediaRouter.stack).to.have.lengthOf(3);
    expect(mediaRouter.stack[0].route.path).to.be.equal('');
    expect(mediaRouter.stack[0].route.stack[0].handle).to.be.equal(diskStorageSingle);
    expect(mediaRouter.stack[0].route.stack[0].name).to.be.equal('multerMiddleware');
    expect(mediaRouter.stack[0].route.stack[0].method).to.be.equal('post');
    expect(mediaRouter.stack[0].route.stack[1].handle).to.be.equal(mediaController.addMedia);
    expect(mediaRouter.stack[0].route.stack[1].name).to.be.equal('addMedia');
    expect(mediaRouter.stack[0].route.stack[1].method).to.be.equal('post');
  });
  it('GET /:mediaId', () => {
    expect(mediaRouter.stack[1].route.path).to.be.equal('/:mediaId');
    expect(mediaRouter.stack[1].route.stack[0].handle).to.be.equal(mediaController.getMediaById);
    expect(mediaRouter.stack[1].route.stack[0].name).to.be.equal('getMediaById');
    expect(mediaRouter.stack[1].route.stack[0].method).to.be.equal('get');
  });
  it('POST /:mediaId', () => {
    expect(mediaRouter.stack[2].route.path).to.be.equal('/:mediaId');
    expect(mediaRouter.stack[2].route.stack[0].handle).to.be.equal(mediaController.deleteMediaById);
    expect(mediaRouter.stack[2].route.stack[0].name).to.be.equal('deleteMediaById');
    expect(mediaRouter.stack[2].route.stack[0].method).to.be.equal('delete');
  });
});
