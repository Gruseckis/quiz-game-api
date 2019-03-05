/* eslint-disable no-unused-expressions */
import indexController from '../../controllers/indexController';

require('dotenv').config();

describe('IndexController', () => {
  describe('.index(req, res)', () => {
    it('response sent successfully', () => {
      process.env.AUTH_HEADER_ENABLED = true;
      const send = { send: sinon.stub() };
      const res = { status: sinon.stub().returns(send) };
      const req = sinon.stub();
      indexController(req, res);
      expect(res.status).to.be.calledWith(404);
      expect(send.send).to.be.calledWith({ payload: { message: 'Resource not found' } });
      expect(req).to.have.not.been.calledOnce;
    });
  });
});
