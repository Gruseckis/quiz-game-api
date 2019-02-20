
import {getUsers, updateUser, deleteUser} from "../models/UserModel";
import AppError from "../errors/AppError";

const logger = require('../utils/logger')('logController');

const getUserInfo = async (req, res) => {
  logger.log('debug', 'logIn: %j', req.body);
  const { user } = req;
  res.status(200).send({
    payload: {
      user
    },
  });
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).send({
      payload: users,
    });
  }catch(error){
    next(new AppError(error.message));
  }
}

const updateOneUser = async (req, res, next) => {
  try {
    const id = req.params.userId;

    const body = {...req.body}; 
    const updatedUser = await updateUser(id, body);
    if(updatedUser){
    res.status(200).send({
      payload: updatedUser
    }); 
  }else {
    throw new AppError('user not found');
  }
  }catch(error){
    next(new AppError(error.message));
  }
}

const deleteOneUser = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const deletedUser = await deleteUser(id);
    if(deletedUser){
      res.status(200).send({
        payload: {
          message: "User deleted"
        }
      });
    } else {
      throw new AppError('user not found');
    }
  }catch(error){
    next(error instanceof AppError ? error : new AppError(error.message));
  }
}

export { getUserInfo, getAllUsers, updateOneUser, deleteOneUser };
