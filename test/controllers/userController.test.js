/* eslint-disable no-unused-expressions */
import AppError from '../../errors/AppError';
import * as UserModel from '../../models/UserModel';
import { getUserInfo, getAllUsers, updateUserById, deleteUserById } from '../../controllers/userController';
import bcrypt from 'bcrypt';

describe('UserController', () => {
  let resSend, res, next;
  beforeEach(() => {
    resSend = { send: sinon.stub() };
    res = { status: sinon.stub().returns(resSend) };
    next = sinon.stub();
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('.getUserInfo(req, res)', () => {
    it('return 200 and user', async () => {
      const req = {
        user: {},
      };
      await getUserInfo(req, res);
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { user: req.user } });
    });
  });
  describe('.getAllUsers', () => {
    it('return 200 and all users', async () => {
      const req = {
        user: { level: 'admin' },
      };
      const users = [];
      const getAllUsersArray = sinon.stub(UserModel, 'getUsers').resolves(users);
      await getAllUsers(req, res, next);
      expect(getAllUsersArray).to.be.calledOnce;
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { users } });
    });
    it('return error when user is not admin', async () => {
      const req = {
        user: { level: '' },
      };
      const getAllUsersArray = sinon.stub(UserModel, 'getUsers');
      await getAllUsers(req, res, next);
      expect(getAllUsersArray).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
    it('return error when database throws error', async () => {
      const req = {
        user: { level: 'admin' },
      };
      const getAllUsersArray = sinon.stub(UserModel, 'getUsers').rejects();
      await getAllUsers(req, res, next);
      expect(getAllUsersArray).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.updateUserById(req, res, next)', () => {
    it('updates user if admin and allow to update level, return 200', async () => {
      const req = {
        user: { level: 'admin' },
        params: { userId: 'id' },
        body: { level: 'admin' },
      };
      const updatedUser = {};
      const updateUser = sinon.stub(UserModel, 'updateUser').resolves(updatedUser);
      await updateUserById(req, res, next);
      expect(updateUser).to.be.calledOnce;
      expect(updateUser).to.be.calledWith(req.params.userId, { level: req.body.level });
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { user: updatedUser } });
    });
    it('update if self hash password, return status 200', async () => {
      const req = {
        user: { id: 'id' },
        params: { userId: 'id' },
        body: { hashedPassword: 'password' },
      };
      const updatedUser = {};
      const rehashPassword = 'rehashedPassword';
      const updateUser = sinon.stub(UserModel, 'updateUser').resolves(updatedUser);
      const hashPassword = sinon.stub(bcrypt, 'hash').resolves(rehashPassword);
      await updateUserById(req, res, next);
      expect(hashPassword).to.be.calledOnce;
      expect(hashPassword).to.be.calledWith(req.body.hashedPassword);
      expect(updateUser).to.be.calledOnce;
      expect(updateUser).to.be.calledWith(req.params.userId, { hashedPassword: rehashPassword });
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { user: updatedUser } });
    });
    it('do not update level if not admin, return error', async () => {
      const req = {
        user: { id: 'id' },
        params: { userId: 'id' },
        body: { level: 'admin', surname: 'surname' },
      };
      const updatedUser = {};
      const updateUser = sinon.stub(UserModel, 'updateUser').resolves(updatedUser);
      await updateUserById(req, res, next);
      expect(updateUser).to.be.calledOnce;
      expect(updateUser).to.be.not.calledWith(req.body.level);
      expect(updateUser).to.be.calledWith(req.params.userId, { surname: req.body.surname });
    });
    it('update if self, return status 200', async () => {
      const req = {
        user: { id: 'id' },
        params: { userId: 'id' },
        body: {},
      };
      const updatedUser = {};
      const updateUser = sinon.stub(UserModel, 'updateUser').resolves(updatedUser);
      await updateUserById(req, res, next);
      expect(updateUser).to.be.calledOnce;
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { user: updatedUser } });
    });
    it('return error if not self or admin', async () => {
      const req = {
        user: { id: 'notTheSame' },
        params: { userId: 'id' },
        body: {},
      };
      const updateUser = sinon.stub(UserModel, 'updateUser');
      await updateUserById(req, res, next);
      expect(updateUser).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(500);
    });
  });
  describe('.deleteUserById(req, res, next)', () => {
    it('successfully delete user when admin, return 200', async () => {
      const req = {
        user: { id: 'notTheSame', level: 'admin' },
        params: { userId: 'id' },
      };
      const deletedUser = {};
      const deleteUser = sinon.stub(UserModel, 'deleteUser').resolves(deletedUser);
      await deleteUserById(req, res, next);
      expect(next).to.be.not.calledOnce;
      expect(deleteUser).to.be.calledOnce;
      expect(deleteUser).to.be.calledWith(req.params.userId);
      expect(res.status).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(resSend.send).to.be.calledWith({ payload: { message: 'User deleted' } });
    });
    it("not admin can't delete user", async () => {
      const req = {
        user: { id: 'notTheSame' },
        params: { userId: 'id' },
      };
      const deleteUser = sinon.stub(UserModel, 'deleteUser');
      await deleteUserById(req, res, next);
      expect(deleteUser).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
    });
    it("admin can't delete himself", async () => {
      const req = {
        user: { id: 'id', level: 'admin' },
        params: { userId: 'id' },
      };
      const deleteUser = sinon.stub(UserModel, 'deleteUser');
      await deleteUserById(req, res, next);
      expect(deleteUser).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
    });
    it('delete unsuccessfull, database error', async () => {
      const req = {
        user: { id: 'notTheSame', level: 'admin' },
        params: { userId: 'id' },
      };
      const deleteUser = sinon.stub(UserModel, 'deleteUser').rejects();
      await deleteUserById(req, res, next);
      expect(deleteUser).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
    });
  });
});
