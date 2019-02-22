import * as ResultModel from '../models/resultModel';
import AppError from '../errors/AppError';


const getAllResults = async (req, res, next) => {
  try {
    const results = await ResultModel.getAllResults();
    res.status(200).send({ payload: results || [] });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getResultById = async (req, res, next) => {
  try {
    const resultById = await ResultModel.getResultById(req.params.resultId);
    res.status(200).send({ payload: resultById });
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
      res.status(200).send({ payload: 'Result is deleted' });
    } else {
      throw new AppError('Result not found');
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const findByIdAndUpdate = async (req, res, next) => {
  try {
    const id = req.params.resultId;
    const { recordIds } = req.body;
    let model = {};
    recordIds ? model.recordIds = recordIds : null;
    const updatedResults = await ResultModel.findByIdAndUpdate(id, model);
    res.status(200).send({ payload: { updatedResults } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export { getAllResults, getResultById, addResults, deleteResultById, findByIdAndUpdate };
