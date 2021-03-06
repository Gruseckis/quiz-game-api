import { getUsers, updateUser, deleteUser } from '../models/UserModel';
import AppError from '../errors/AppError';
import { accessLevelCheck } from '../helpers/accessLevelCheck';
import bcrypt from 'bcrypt';

const logger = require('../utils/logger')('logController');

const getUserInfo = async (req, res) => {
  logger.log('debug', 'logIn: %j', req.body);
  const { user } = req;
  res.status(200).send({
    payload: {
      user,
    },
  });
};

const getAllUsers = async (req, res, next) => {
  try {
    if (accessLevelCheck(req.user.level, 'admin')) {
      const users = await getUsers();
      res.status(200).send({
        payload: { users },
      });
    } else {
      throw new AppError('Only admin can get all the users');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    if (req.user.id === id || accessLevelCheck(req.user.level, 'admin')) {
      const { level, hashedPassword, name, surname, email, dateOfBirth } = req.body;
      let userUpdate = {};

      if (hashedPassword) {
        const reshedPassword = await bcrypt.hash(hashedPassword, parseInt(process.env.PASSWORD_HASHING_ROUNDS, 10));
        userUpdate.hashedPassword = reshedPassword;
      }
      if (req.user.level === 'admin') {
        level ? (userUpdate.level = level) : null;
      }
      name ? (userUpdate.name = name) : null;
      surname ? (userUpdate.surname = surname) : null;
      email ? (userUpdate.email = email) : null;
      dateOfBirth ? (userUpdate.dateOfBirth = dateOfBirth) : null;

      const updatedUser = await updateUser(id, userUpdate);
      res.status(200).send({
        payload: { user: updatedUser },
      });
      return;
    } else {
      throw new AppError('User can only change onw data');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    if (accessLevelCheck(req.user.level, 'admin') && req.user.id !== id) {
      const deletedUser = await deleteUser(id);
      if (deletedUser) {
        res.status(200).send({
          payload: {
            message: 'User deleted',
          },
        });
      } else {
        throw new AppError('User not found', 400);
      }
    } else {
      throw new AppError("Only admin can delete the user and admin can't delete himself", 400);
    }
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message, 400));
  }
};

export { getUserInfo, getAllUsers, updateUserById, deleteUserById };
