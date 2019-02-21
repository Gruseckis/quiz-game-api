import { getUsers, updateUser, deleteUser } from '../models/UserModel';
import AppError from '../errors/AppError';
import { accessLevelCheck } from '../helpers/accessLevelCheck';
const bcrypt = require('bcrypt');

const logger = require('../utils/logger')('logController');

const getUserInfo = async (req, res) => {
  logger.log('debug', 'logIn: %j', req.body);
  const { user } = req;
  res.status(200).send({
    payload: {
      user
    }
  });
};

const getAllUsers = async (req, res, next) => {
  try {
    if (accessLevelCheck(req.user.level, 'admin')) {
      const users = await getUsers();
      res.status(200).send({
        payload: users
      });
    } else {
      throw new AppError('Only admin can get all the users');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updateOneUser = async (req, res, next) => {
  try {
    const id = req.params.userId;
    if (accessLevelCheck(req.user.level, 'admin')) {
      const updatedUser = await updateUser(id, { ...req.body });
      if (updatedUser) {
        res.status(200).send({
          payload: updatedUser
        });
      } else {
        throw new AppError('User not found');
      }
    }
    if (req.user._id.toString() === id) {
      const hashedPassword = await bcrypt.hash(
        req.body.hashedPassword,
        parseInt(process.env.PASSWORD_HASHING_ROUNDS, 10)
      );
      const { username } = req.body;
      const body = { username, hashedPassword };
      const updatedUser = await updateUser(id, { ...body });
      if (updatedUser) {
        res.status(200).send({
          payload: updatedUser
        });
      } else {
        throw new AppError('You do not have a permision to update');
      }
    } else {
      throw new AppError('You do not have a permision to update');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteOneUser = async (req, res, next) => {
  try {
    const id = req.params.userId;
    if (accessLevelCheck(req.user.level, 'admin')) {
      const deletedUser = await deleteUser(id);
      if (deletedUser) {
        res.status(200).send({
          payload: {
            message: 'User deleted'
          }
        });
      } else {
        throw new AppError('user not found');
      }
    } else {
      throw new AppError('Only admin can delete the user');
    }
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message));
  }
};

export { getUserInfo, getAllUsers, updateOneUser, deleteOneUser };
