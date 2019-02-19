import express from 'express';
import './utils/dotenv';
import cors from 'cors';
import defaultErrorHandler from './middlewares/defaultErrorHandler';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import index from './routes/index';

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


app.use(`/api/v${process.env.API_VERSION}`, index);


app.use('/uploads', express.static('uploads'));
app.use(defaultErrorHandler);

const host = process.env[`HOST_${process.platform.toUpperCase()}`];
const port = process.env.PORT || process.env.HOST_PORT;

app.listen(port, host, () => {
  logger.log('info', `App is running at http://${host}:${port} in ${app.get('env')} mode.`);
});
