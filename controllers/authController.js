import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';
import * as UserModel from '../models/UserModel';

const logger = require('../utils/logger')('logController');


const register = async (req, res, next) => {
    logger.log('debug', 'register: %j', req.body);
    const { username, email, hashedPassword, name, surname, dateOfBirth, level } = req.body;
    try {
        await UserModel.save({
            username: username,
            email: email,
            hashedPassword: hashedPassword,
            name: name,
            surname: surname,
            dateOfBirth: dateOfBirth,
            level: level, //???
        });
        console.log(req.body.level)
        logger.log('info', `Successfully registered: ${req.body.username}`);
        res.status(200).send({ payload: { message: 'Successfully registered' } });
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};



const login = async (req, res, next) => {
    logger.log('debug', 'logIn: %j', req.body);
    try {
        const user = await UserModel.getUserByName(req.body.username);
        console.log(req.body.level)

        if (!user) {
            logger.log('debug', 'Login failed');
            throw new AppError('Wrong user credentials!', 400);
        }

        const isPasswordsEqual = await UserModel.comparePassword({
            userPassword: req.body.hashedPassword,
            hashedPassword: user.hashedPassword,
        });
        if (isPasswordsEqual) {
            const token = jwt.sign(
                {
                    data: { username: user.username },
                },
                process.env.JWT_SECRET,
                { expiresIn: '6h' }, //???
            );
            logger.log('info', `Successfully loged in: ${user.username}`);
            res.status(200).send({ payload: { message: 'Successfully loged in', token } });
        } else {
            throw new AppError('CHECK TOKEN PART', 400);
        }
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Wrong user credentials!', 400));
    }
};

export { register, login };
