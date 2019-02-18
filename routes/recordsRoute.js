import express from "express";

import {
  getRecordsById,
  getAllRecord,
  addRecords,
  deleteRecords,
  updateRecords
} from "../controllers/recordsController";

const router = express.Router();
//this routes has been created
router.post("/", addRecords);
router.get("/", getAllRecord);
router.get("/:recordId", getRecordsById);
router.delete("/:recordId", deleteRecords);
router.patch("/:recordId", updateRecords);

export default router;
