import AppError from '../errors/AppError';
import * as RecordModel from '../models/recordsModel';
import { ResultModel } from '../models/resultModel';

const getAllRecords = async (req, res) => {
  try {
    const record = await RecordModel.getAllRecords();
    res.status(200).send({ payload: record });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await RecordModel.getRecordById(req.params.recordId);
    if (record) {
      res.status(200).send({ payload: record });
    } else {
      throw new AppError('Invalid Id');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const addRecord = async (req, res, next) => {
  try {
    const record = await RecordModel.save({
      questionId: req.body.questionId,
      answers: req.body.answers,
    });
    await ResultModel.findByIdAndUpdate(req.body.resultId, { $push: { recordIds: record.id } });
    res.status(201).send({ payload: { message: 'Record was created', record } });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await RecordModel.updateById(req.params.recordId, {
      ...req.body,
    });
    if (!record) {
      throw new AppError("This record doesn't exist");
    }
    res.status(200).send({ payload: record });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const remove = await RecordModel.deleteRecordById(req.params.recordId);
    if (!remove) {
      throw new AppError('Send valid recordId');
    }
    res.status(200).send({ payload: { message: 'Record has been deleted' } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export { getRecordById, getAllRecords, addRecord, deleteRecord, updateRecord };
