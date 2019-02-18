
import * as UserModel from "../models/userModel";
import AppError from "../errors/AppError";

const logger = require('../utils/logger')('logController');

const getUserInfo = async (req, res) => {
  logger.log('debug', 'logIn: %j', req.body);
  const { user } = req;
  res.status(200).send({
    payload: {
      username: user.username,
      email: user.email,
      hashedPassword: user.hashedPassword,
      name: user.name,
      surname: user.surname,
      dateOfBirth: user.dateOfBirth,
      level: user.level,
      id: user._id
    },
  });
};

const getUsers = async (req,res, next) => {
  try {
    const users = await UserModel.getUsers();
    res.status(200).send({
      payload: users,
    });
  }catch(error){
    next(new AppError(error.message));
  }
}

export { getUserInfo, getUsers };
