import jwt from 'jsonwebtoken';
import AuthError from '../errors/AuthError';
import { getUserByUsername } from '../models/UserModel';

const logger = require('../utils/logger')('authenticate');

const jwtVerify = token =>
  new Promise(resolve => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
      resolve(decodedToken);
    });
  });

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization) {
    [, token] = authorization.split(' ');
  }
  if (token) {
    const decodedToken = await jwtVerify(token);

    if (decodedToken && decodedToken.data && decodedToken.data.username) {
      const { username } = decodedToken.data;
      const user = await getUserByUsername(username);
      if (user) {
        logger.log('info', `User: ${username} was successfully authenticated`);
        req.user = user;
        return next();
      }
    }
    return next(new AuthError('Invalid token'));
  }
  return next(new AuthError('No token provided or token expired'));
};

export default authenticate;
