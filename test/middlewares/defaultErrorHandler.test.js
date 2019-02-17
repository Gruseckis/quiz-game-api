/* eslint-disable no-unused-expressions */
import AppError from '../../errors/AppError';
import defaultErrorHandler from '../../middlewares/defaultErrorHandler';

require('dotenv').config();

describe('Middleware .defaultErrorHandler(error, req, res, next)', () => {
  it('defaultErrorHandler should res.send error', async () => {
    const req = {
      headers: {
        authorization: 'authorization authorization',
      },
    };
    const resSend = { send: sinon.stub() };
    const res = { status: sinon.stub().returns(resSend) };
    const next = sinon.stub();
    const error = new AppError('Test error', 400);
    await defaultErrorHandler(error, req, res, next);
    expect(res.status).to.be.calledWith(error.status);
    expect(resSend.send).to.be.calledWith({ error: error.message });
    expect(next).to.be.not.calledOnce;
  });
});
