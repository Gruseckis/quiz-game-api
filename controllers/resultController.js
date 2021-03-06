import * as ResultModel from '../models/resultModel';
import * as RecordModel from '../models/recordsModel';
import AppError from '../errors/AppError';

const getAllResults = async (req, res, next) => {
  try {
    const results = await ResultModel.getAllResults();
    res.status(200).send({ payload: { results: results || [] } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getResultById = async (req, res, next) => {
  try {
    if (!req.params.resultId) {
      throw new AppError('resultId required.');
    }
    const resultById = await ResultModel.getResultById(req.params.resultId);
    res.status(200).send({ payload: { result: resultById } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const addResults = async (req, res, next) => {
  try {
    const result = await ResultModel.save({
      quizId: req.body.quizId,
      userId: req.user._id,
    });
    res.status(200).send({ payload: { result } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteResultById = async (req, res, next) => {
  try {
    const id = req.params.resultId;
    const deletedResult = await ResultModel.deleteResultById(id);
    if (deletedResult) {
      const recordIdArray = [...deletedResult.recordIds];
      await RecordModel.deleteRecordsFromIdArray(recordIdArray);
      res.status(200).send({ payload: { message: 'Result is deleted' } });
    } else {
      throw new AppError('Result not found');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updateResultById = async (req, res, next) => {
  try {
    const id = req.params.resultId;
    const { recordIds } = req.body;
    let model = {};
    if (!recordIds || recordIds.length === 0) {
      throw new AppError('Nothing to update');
    }
    model.recordIds = recordIds;
    const updatedResults = await ResultModel.findByIdAndUpdate({ id, model });
    res.status(200).send({ payload: { result: updatedResults } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export { getAllResults, getResultById, addResults, deleteResultById, updateResultById };
