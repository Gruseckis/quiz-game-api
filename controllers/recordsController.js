import AppError from '../errors/AppError';
import * as RecordModel from '../models/recordsModel';
import { ResultModel } from '../models/resultModel';
import { accessLevelCheck } from '../helpers/accessLevelCheck';
import { getQuestionByID } from '../models/questionModel';
import { getQuizByQuestionId } from '../models/QuizModel';

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
      textAnswer: req.body.textAnswer
    });
    const question = await getQuestionByID(req.body.questionId)
    const correctAnswersArray = question.correct;
    let correct = false;
    if(arraysEqual(correctAnswersArray, req.body.answers)){
      correct = true;
    }
    const quiz = await getQuizByQuestionId(req.body.questionId);
    const quesionsArray = quiz.questions;
    const indexOfCurrentQuestion = quesionsArray.indexOf(req.body.questionId);
    const nextQuestionId = quesionsArray[indexOfCurrentQuestion + 1] || null;
    await ResultModel.findByIdAndUpdate(req.body.resultId, { $push: { recordIds: record.id } });
    
    res.status(200).send({ payload: { message: 'Saved', correct, nextQuestionId } });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

function arraysEqual(arr1, arr2) {
  if(arr1.length !== arr2.length)
      return false;
  for(let i = arr1.length; i--;) {
      if(parseInt(arr1[i]) !== parseInt(arr2[i]))
          return false;
  }
  return true;
}

const updateRecord = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (accessLevelCheck(req.user.level, 'moderator')) {
      let recordUpdate = {};
      let updatedRecord;

      if (body.answers) {
        recordUpdate['answers'] = body.answers;
      }
      if (body.textAnswer) {
        recordUpdate['textAnswer'] = body.textAnswer;
      }

      if (Object.keys(recordUpdate).length <= 0) {
        throw new AppError('Nothing to update');
      } else {
        updatedRecord = await RecordModel.updateById(req.params.recordId, recordUpdate);
      }

      if (!updatedRecord) {
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
    await ResultModel.update(req.body.resultId, { $pull: { recordIds: req.params.recordId } });
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
