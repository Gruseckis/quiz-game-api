import express from 'express';
import './utils/dotenv';
import cors from 'cors';
import defaultErrorHandler from './middlewares/defaultErrorHandler';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import resultsRoute from './routes/resultsRoutes';
import index from './routes/index';

import questionRouter from './routes/questionRoutes';

import usersRoutes from './routes/usersRoutes';
import quizRoutes from './routes/quizRouter';

import authRouter from './routes/authRouter';
import authenticate from './middlewares/authenticate'

const app = express();
const logger = require('./utils/logger')('server');
mongoose.Promise = global.Promise; // Use native promises - http://mongoosejs.com/docs/promises.html
mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
});
mongoose.connection.on('error', error => {
  logger.log('error', 'MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});
mongoose.connection.once('open', () => logger.log('info', 'MongoDB has been connected.'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.use(`/api/v${process.env.API_VERSION}/questions`, authenticate, questionRouter);
app.use(`/api/v${process.env.API_VERSION}/auth`, authRouter);
app.use(`/api/v${process.env.API_VERSION}/results`, authenticate, resultsRoute);
app.use(`/api/v${process.env.API_VERSION}`, index);
app.use(`/api/v${process.env.API_VERSION}/users`, authenticate, usersRoutes);
app.use(`/api/v${process.env.API_VERSION}/quizzes`, authenticate, quizRoutes);


app.use(`/api/v${process.env.API_VERSION}`, index);
app.use('/uploads', express.static('uploads'));
app.use(defaultErrorHandler);
const host = process.env[`HOST_${process.platform.toUpperCase()}`];
const port = process.env.PORT || process.env.HOST_PORT;
app.listen(port, host, () => {
  logger.log('info', `App is running at http://${host}:${port} in ${app.get('env')} mode.`);
});
