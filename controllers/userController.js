
import {getUsers, updateUser, deleteUser, getUserById} from "../models/UserModel";
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
    if(await isOwner(req.user._id, id) || req.user.level == "admin"){
      const body = {...req.body}; 
      const updatedUser = await updateUser(id, body);
      if(updatedUser){
        res.status(200).send({
          payload: updatedUser
        }); 
      }else {
        throw new AppError('user not found');
      }
    } else {
      throw new AppError('Only owner or admin can update the user');
    }
  }catch(error){
    next(new AppError(error.message));
  }
}

const deleteOneUser = async (req, res, next) => {
  try {
    const id = req.params.userId;
    if(req.user.level == "admin"){
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
    }else {
      throw new AppError('Only admin can delete the user');
    }
  }catch(error){
    next(error instanceof AppError ? error : new AppError(error.message));
  }
}

const isOwner = async(userId, userIdFromParams) => {
  const user = await getUserById(userId);
  const id = user._id;
  if(id == userIdFromParams){
    return true
  } else {
    return false
  }
}

export { getUserInfo, getAllUsers, updateOneUser, deleteOneUser };
