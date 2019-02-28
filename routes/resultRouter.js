import express from 'express';

import * as resultController from '../controllers/resultController';

const router = express.Router();

router.get('', resultController.getAllResults);
router.post('', resultController.addResults);
router.get('/:resultId', resultController.getResultById);
router.patch('/:resultId', resultController.updateResultById);
router.delete('/:resultId', resultController.deleteResultById);

export default router;
