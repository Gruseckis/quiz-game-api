import express from 'express';
import { diskStorageSingle } from '../middlewares/diskStorage';
import * as mediaController from '../controllers/mediaController';

const router = express.Router();

router.get('/:mediaId', mediaController.getMediaById);
router.post('', diskStorageSingle, mediaController.addMedia);
router.delete('/:mediaId', mediaController.deleteMediaById);

export default router;