import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';
import { save, getUserByName, comparePassword } from '../models/UserModel';

const authController = require('../utils/logger')('logController');


const register = async (req, res, next) => {
    authController.log('debug', 'register: %j', req.body);
    const { body } = req;
    try {
        await save({
            username: body.username,
            email: body.email,
            hashedPassword: body.hashedPassword,
            name: body.name,
            surname: body.surname,
            dateOfBirth: body.dateOfBirth,
            level: body.level, //???
        });
        console.log(req.body.level)
        authController.log('info', `Successfully registered: ${req.body.username}`);
        res.status(200).send({ user });
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

const login = async (req, res, next) => {
    authController.log('debug', 'logIn: %j', req.body);
    try {
        const user = await getUserByName(req.body.username);
        if (!user) {
            authController.log('debug', 'Login failed');
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
                        email: user.email
                    },
                },
                process.env.JWT_SECRET,
                { expiresIn: '6h' },
            );
            authController.log('info', `Successfully loged in: ${user.username}`);
            res.status(200).send({ payload: { message: 'Successfully loged in', token } });
        } else {
            throw new AppError('CHECK TOKEN PART', 400);
        }
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Wrong user credentials!', 400));
    }
};

export { register, login };
