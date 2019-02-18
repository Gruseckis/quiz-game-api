import express from 'express';

import { getUserInfo, getAllUsers, updateOneUser, deleteOneUser } from '../controllers/userController';

const router = express.Router();

router.get('/self', getUserInfo);
router.get('/', getAllUsers);
router.patch('/:userId', updateOneUser);
router.delete('/:userId', deleteOneUser);
export default router;
