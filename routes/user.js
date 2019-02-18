import express from 'express';

import { getUserInfo, getUsers, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

router.get('/self', getUserInfo);
router.get('/', getUsers);
router.patch('/:userId', updateUser);
router.delete('/:userId', deleteUser);
export default router;
