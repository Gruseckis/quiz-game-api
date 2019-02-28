/* eslint-disable no-unused-expressions */
import * as usersController from '../../controllers/userController';
import usersRoutes from '../../routes/userRouter';

describe('usersRoutes', () => {
  it('GET /self', () => {
    expect(usersRoutes.stack).to.have.lengthOf(4);
    expect(usersRoutes.stack[0].route.path).to.be.equal('/self');
    expect(usersRoutes.stack[0].route.stack[0].handle).to.be.equal(usersController.getUserInfo);
    expect(usersRoutes.stack[0].route.stack[0].name).to.be.equal('getUserInfo');
    expect(usersRoutes.stack[0].route.stack[0].method).to.be.equal('get');
  });
  it('GET allUsers', () => {
    expect(usersRoutes.stack[1].route.path).to.be.equal('');
    expect(usersRoutes.stack[1].route.stack[0].handle).to.be.equal(usersController.getAllUsers);
    expect(usersRoutes.stack[1].route.stack[0].name).to.be.equal('getAllUsers');
    expect(usersRoutes.stack[1].route.stack[0].method).to.be.equal('get');
  });
  it('PATCH /:userId', () => {
    expect(usersRoutes.stack[2].route.path).to.be.equal('/:userId');
    expect(usersRoutes.stack[2].route.stack[0].handle).to.be.equal(usersController.updateUserById);
    expect(usersRoutes.stack[2].route.stack[0].name).to.be.equal('updateUserById');
    expect(usersRoutes.stack[2].route.stack[0].method).to.be.equal('patch');
  });
  it('DELETE /:userId', () => {
    expect(usersRoutes.stack[3].route.path).to.be.equal('/:userId');
    expect(usersRoutes.stack[3].route.stack[0].handle).to.be.equal(usersController.deleteUserById);
    expect(usersRoutes.stack[3].route.stack[0].name).to.be.equal('deleteUserById');
    expect(usersRoutes.stack[3].route.stack[0].method).to.be.equal('delete');
  });
});
