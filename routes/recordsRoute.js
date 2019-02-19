import express from 'express';

import {
  getRecordById,
  getAllRecords,
  addRecord,
  deleteRecord,
  updateRecord
} from '../controllers/recordsController';

const router = express.Router();
router.post('/', addRecord);
router.get('/', getAllRecords);
router.get('/:recordId', getRecordById);
router.delete('/:recordId', deleteRecord);
router.patch('/:recordId', updateRecord);

export default router;
