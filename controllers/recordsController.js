import AppError from '../errors/AppError';
import * as RecordModel from '../models/recordsModel';
import { ResultModel } from '../models/resultModel';
import { accessLevelCheck } from '../helpers/accessLevelCheck';

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
    const body = { ...req.body };
    if(accessLevelCheck(req.user.level,'moderator')){
      const keys = Object.keys(body);
      let recordUpdate = {};
      let updatedRecord;

      keys.forEach(key => {
        if (key === 'answers' || key === 'textAnswer') {
          if (body[key] !== null) {
            recordUpdate[key] = body[key];
          }
        }
      });

      if (Object.keys(recordUpdate).length <= 0) {
        throw new AppError('Nothing to update');
      } else {
        updatedRecord = await RecordModel.updateById(req.params.recordId, recordUpdate);
      }
      
      if(!updatedRecord){
        throw new AppError("Record not found");
      }
      res.status(200).send({
        payload: updatedRecord
      });
    } else {
      throw new AppError('Only moderator or admin can update record');
    }
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(error.message));
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
