import express from 'express';

import {
  getRecordById,
  getAllRecords,
  addRecord,
  deleteRecordById,
  updateRecordById,
} from '../controllers/recordsController';

const router = express.Router();
router.get('', getAllRecords);
router.post('', addRecord);
router.get('/:recordId', getRecordById);
router.patch('/:recordId', updateRecordById);
router.delete('/:recordId', deleteRecordById);

export default router;
