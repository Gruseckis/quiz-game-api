/* eslint-disable no-unused-expressions */
import { register, login } from '../../controllers/authController';
import authRouter from '../../routes/authRouter';

describe('AuthRouter', () => {
  it('POST /register', () => {
    expect(authRouter.stack).to.have.lengthOf(2);
    expect(authRouter.stack[0].route.path).to.be.equal('/register');
    expect(authRouter.stack[0].route.stack[0].name).to.be.equal('register');
    expect(authRouter.stack[0].route.stack[0].method).to.be.equal('post');
    expect(authRouter.stack[0].route.stack[0].handle).to.be.equal(register);
  });
  it('POST /login', () => {
    expect(authRouter.stack[1].route.path).to.be.equal('/login');
    expect(authRouter.stack[1].route.stack[0].name).to.be.equal('login');
    expect(authRouter.stack[1].route.stack[0].method).to.be.equal('post');
    expect(authRouter.stack[1].route.stack[0].handle).to.be.equal(login);
  });
});
