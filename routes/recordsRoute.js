import express from 'express';

import {
  getRecordById,
  getAllRecords,
  addRecord,
  deleteRecords,
  updateRecords
} from '../controllers/recordsController';

const router = express.Router();
router.post('/', addRecord);
router.get('/', getAllRecords);
router.get('/:recordId', getRecordById);
router.delete('/:recordId', deleteRecords);
router.patch('/:recordId', updateRecords);

export default router;
