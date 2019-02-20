import express from 'express';
import { diskStorageSingle } from '../middlewares/diskStorage';
import * as mediaController from '../controllers/mediaController';

const router = express.Router();

router.post('', diskStorageSingle, mediaController.addMedia);
router.route('/:mediaId')
  .get(mediaController.getMediaById)
  .delete(mediaController.deleteMediaById);

export default router;