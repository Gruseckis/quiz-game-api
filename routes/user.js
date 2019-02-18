import express from 'express';

import { getUserInfo, getUsers } from '../controllers/userController';

const router = express.Router();

router.get('/self', getUserInfo);
router.get('/', getUsers);

export default router;
