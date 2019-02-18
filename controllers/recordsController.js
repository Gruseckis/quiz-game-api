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

const getRecordsById = async (req, res, next) => {
  try {
    const record = await getRecordById(req.params.recordId);
    if (record) {
      res.status(200).send({ payload: record });
    } else {
      throw new AppError("Invalid Id");
    }
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

const updateRecords = async (req, res, next) => {
  try {
    const record = await updateById(req.params.recordId, { ...req.body });
    if (!record) {
      throw new AppError("This record doesn't exist");
    }
    res.status(200).send({ payload: record });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteRecords = async (req, res, next) => {
  try {
    const remove = await deleteRecordById(req.params.recordId);
    if (!remove) {
      throw new AppError("Send valid recordId");
    }
    res.status(200).send({ payload: { message: "Record has been deleted" } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export {
  getRecordsById,
  getAllRecord,
  addRecords,
  deleteRecords,
  updateRecords
};
