import express from "express";

import {
  getRecordsById,
  getAllRecord,
  addRecords,
  deleteRecords,
  patchRecords
} from "../controllers/recordsController";

const router = express.Router();
//this routes has been created
router.get("/", getAllRecord);
router.post("/", addRecords);
router.delete("/", deleteRecords);
router.patch("/", patchRecords);

export default router;
