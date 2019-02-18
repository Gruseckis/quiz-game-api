import AppError from "../errors/AppError";

import {
  save,
  getRecordById,
  updateById,
  deleteRecordById,
  getAllRecords
} from "../models/recordsModel";

const getAllRecord = async (req, res) => {
  try {
    const record = await getAllRecords(req.body.recordId);
    res.status(200).send({ payload: record });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getRecordsById = async (req, res) => {
  try {
    const record = await getRecordById(req.body.recordId);
    res.status(200).send({ payload: record });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const addRecords = async (req, res, next) => {
  try {
    const record = await save({
      questionId: req.body.questionId,
      answers: req.body.answersId
    });
    res.status(201).send({ message: { payload: record } });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const patchRecords = async (req, res, next) => {
  try {
    const record = await updateById(req.params.recordId, { ...req.body });
    res.status(200).send({ payload: record });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteRecords = async (req, res) => {
  try {
    const remove = await deleteRecordById(req.body.recordId);
    res.status(200).send({ payload: "Record has been deleted" });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export {
  getRecordsById,
  getAllRecord,
  addRecords,
  deleteRecords,
  patchRecords
};
