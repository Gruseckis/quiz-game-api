import express from 'express';
import { diskStorageSingle } from '../middlewares/diskStorage';
import * as mediaController from '../controllers/mediaController';

const router = express.Router();

router.get('/:mediaId', mediaController.getMediaById);
router.post('', diskStorageSingle, mediaController.addMedia);

export default router;