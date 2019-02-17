import express from 'express';
import './utils/dotenv';
import cors from 'cors';
import defaultErrorHandler from './middlewares/defaultErrorHandler';
import bodyParser from 'body-parser';

const app = express();
const logger = require('./utils/logger')('server');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing

app.use(`/api/v${process.env.API_VERSION}`, (req, res) => {
  res.status(200).send({ message: 'Quiz-game API' });
});

app.use('/uploads', express.static('uploads'));
app.use(defaultErrorHandler);

const host = process.env[`HOST_${process.platform.toUpperCase()}`];
const port = process.env.PORT || process.env.HOST_PORT;

app.listen(port, host, () => {
  logger.log('info', `App is running at http://${host}:${port} in ${app.get('env')} mode.`);
});
