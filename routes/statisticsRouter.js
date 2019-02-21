import express from 'express';

import * as statisticsController from '../controllers/statisticsController';

const router = express.Router();

router.get('/quizzes/:quizId', statisticsController.getQuizStatistics);

export default router;