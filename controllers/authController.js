import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';
import { save, getUserByUsername, comparePassword } from '../models/UserModel';
import validator from 'validator';
const logger = require('../utils/logger')('authController');

const register = async (req, res, next) => {
  logger.log('debug', 'register: %j', req.body);
  const { body } = req;
  try {
    let { email } = req.body;
    email = email === undefined || email === null ? '' : email;
    if (validator.isEmail(email)) {
      const user = await save({
        username: body.username.toLowerCase(),
        email: body.email,
        hashedPassword: body.hashedPassword,
        name: body.name,
        surname: body.surname,
        dateOfBirth: body.dateOfBirth,
      });
      logger.log('info', `Successfully registered: ${body.username}`);
      res.status(201).send({ payload: { message: 'Successfully registered', user } });
      return;
    }

    throw new AppError('Please provide valid mail address!', 400);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const login = async (req, res, next) => {
  logger.log('debug', 'logIn: %j', req.body);
  try {
    const user = await getUserByUsername(req.body.username.toLowerCase());
    if (!user) {
      logger.log('debug', `Login failed for user: ${req.body.username}`);
      throw new AppError('Wrong user credentials!', 400);
    }
    const isPasswordsEqual = await comparePassword({
      userPassword: req.body.hashedPassword,
      hashedPassword: user.hashedPassword,
    });
    if (isPasswordsEqual) {
      const token = jwt.sign(
        {
          data: {
            username: user.username,
            email: user.email,
            name: user.name,
            surname: user.surname,
            dateOfBirth: user.dateOfBirth,
            level: user.level,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: '6h' }
      );
      logger.log('info', `Successfully loged in: ${user.username}`);
      res.status(200).send({ payload: { message: 'Successfully loged in', token } });
    } else {
      throw new AppError('Wrong user credentials!', 400);
    }
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Wrong user credentials!', 400));
  }
};

export { register, login };
