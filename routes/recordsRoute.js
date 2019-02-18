import express from "express";

import {
  getRecords,
  postRecords,
  deleteRecords,
  patchRecords
} from "../controllers/recordsController";

const router = express.Router();

router.get("/*", getRecords);
router.post("/*", postRecords);
router.delete("/:userId", deleteRecords);
router.patch("/:userId", patchRecords);

export default router;
