import express from 'express';

import { getUserInfo, getAllUsers, updateUserById, deleteUserById } from '../controllers/userController';

const router = express.Router();

router.get('/self', getUserInfo);
router.get('', getAllUsers);
router.patch('/:userId', updateUserById);
router.delete('/:userId', deleteUserById);
export default router;
