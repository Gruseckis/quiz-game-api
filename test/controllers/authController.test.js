/* eslint-disable no-unused-expressions */
import AppError from '../../errors/AppError';
import * as UserModel from '../../models/UserModel';
import { register, login } from '../../controllers/authController';
import jwt from 'jsonwebtoken';

require('dotenv').config();

describe('AuthController', () => {
  describe('.register(req, res, next)', () => {
    const validRegBody = {
      username: 'Username',
      email: 'email@email.com',
      hashedPassword: 'hashedPassword',
      name: 'Name',
      surname: 'Surname',
      dateOfBirth: '1988-02-22',
    };

    it('successfully registered, status 200', async () => {
      const req = {
        body: validRegBody,
      };
      const resSend = { send: sinon.stub() };
      const res = { status: sinon.stub().returns(resSend) };
      const user = {};
      const saveUser = sinon.stub(UserModel, 'save').resolves(user);
      const next = sinon.stub();
      await register(req, res, next);
      expect(res.status).to.be.calledWith(200);
      expect(saveUser).to.be.calledWith({
        username: req.body.username.toLowerCase(),
        email: req.body.email,
        hashedPassword: req.body.hashedPassword,
        name: req.body.name,
        surname: req.body.surname,
        dateOfBirth: req.body.dateOfBirth,
      });
      expect(resSend.send).to.be.calledWith({ payload: { message: 'Successfully registered', user } });
      expect(next).to.be.not.calledOnce;
      sinon.restore();
    });
    it('throws and error when email is invalid', async () => {
      const req = {
        body: {},
      };
      const resSend = { send: sinon.stub() };
      const res = { status: sinon.stub().returns(resSend) };
      const saveUser = sinon.stub(UserModel, 'save');
      const next = sinon.stub();
      await register(req, res, next);
      expect(saveUser).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
      sinon.restore();
    });
    it("unsucessfully registered, can't save", async () => {
      const req = {
        body: validRegBody,
      };
      const resSend = { send: sinon.stub() };
      const res = { status: sinon.stub().returns(resSend) };
      const saveUser = sinon.stub(UserModel, 'save').rejects();
      const next = sinon.stub();
      await register(req, res, next);
      expect(saveUser).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
      sinon.restore();
    });
  });
  describe('.login(req, res, next)', () => {
    it('successfully logged in, status 200', async () => {
      const req = {
        body: {
          username: 'Username',
          hashedPassword: 'hashedPassword',
        },
      };
      const user = {
        username: 'username',
        hashedPassword: 'hashedPassword',
        email: 'email',
        level: 'level',
        dateOfBirth: 'dateOfBirth',
        name: 'name',
        surname: 'surname',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      };
      const resSend = { send: sinon.stub() };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByUsername = sinon.stub(UserModel, 'getUserByUsername').resolves(user);
      const comparePassword = sinon.stub(UserModel, 'comparePassword').resolves(true);
      const jwtToken = new Promise(resolve => resolve);
      const jwtSign = sinon.stub(jwt, 'sign').resolves(jwtToken);
      await login(req, res, next);
      expect(getUserByUsername).to.be.calledWith(req.body.username.toLowerCase());
      expect(comparePassword).to.be.calledWith({
        userPassword: req.body.hashedPassword,
        hashedPassword: user.hashedPassword,
      });
      expect(jwtSign).to.be.calledOnce;
      expect(jwtSign).to.be.calledWith(
        {
          data: {
            username: user.username,
            email: user.email,
            level: user.level,
            name: user.name,
            surname: user.surname,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
            dateOfBirth: user.dateOfBirth,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: '6h' }
      );
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { message: 'Successfully loged in', token: jwtToken } });
      sinon.restore();
    });
    it('unsuccessfully logged in, username incorrect', async () => {
      const resSend = { send: sinon.stub() };
      const req = {
        body: {
          username: 'Username',
          hashedPassword: 'hashedPassword',
        },
      };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByUsername = sinon.stub(UserModel, 'getUserByUsername').resolves(undefined);
      const comparePassword = sinon.stub(UserModel, 'comparePassword').resolves();
      await login(req, res, next);
      expect(getUserByUsername).to.be.calledOnce;
      expect(comparePassword).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
      sinon.restore();
    });
    it('unsuccessfully logged in, username password', async () => {
      const req = {
        body: {
          username: 'Username',
          hashedPassword: 'hashedPassword',
        },
      };
      const user = {
        username: 'username',
        hashedPassword: 'wrongPassword',
      };
      const resSend = { send: sinon.stub() };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByUsername = sinon.stub(UserModel, 'getUserByUsername').resolves(user);
      const comparePassword = sinon.stub(UserModel, 'comparePassword').resolves(false);
      await login(req, res, next);
      expect(getUserByUsername).to.be.calledOnce;
      expect(comparePassword).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
      sinon.restore();
    });
    it('unsuccessfully logged in, database error', async () => {
      const req = {
        body: {
          username: 'Username',
          hashedPassword: 'hashedPassword',
        },
      };
      const resSend = { send: sinon.stub() };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByUsername = sinon.stub(UserModel, 'getUserByUsername').rejects();
      const comparePassword = sinon.stub(UserModel, 'comparePassword');
      await login(req, res, next);
      expect(getUserByUsername).to.be.calledOnce;
      expect(comparePassword).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      expect(next.args[0][0].status).to.be.equal(400);
      sinon.restore();
    });
  });
});
