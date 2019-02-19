import * as ResultModel from '../models/resultModel';

import AppError from '../errors/AppError';


const getAllResults = async (req, res, next) => {
    // logger.log('debug', 'getResults: %j', req.body);
    try {
        const results = await ResultModel.getAllResults();
        results.forEach(result => {
            console.log(result)
        });
        res.status(200).send({ payload: results || [] });
    } catch (error) {
        next(new AppError(error.message));
    }
};



const getResultById = async (req, res, next) => {
    // logger.log('debug', 'getResultById: %j', req.body);
    try {
        const post = await ResultModel.getResultById(req.params.resultId);
        res.status(200).send({ payload: post });
    } catch (error) {
        next(new AppError(error.message));
    }
};


const addResults = async (req, res, next) => {
    try {
        const result = await ResultModel.save({
            message: req.body.text,
            username: req.user.username,
            resultId: req.params.resultId
        });

        res.status(200).send({ payload: { result } });
    } catch (error) {
        next(new AppError(error.message));
    }
};

const deleteResultById = async (req, res, next) => {
    try {
        const id = req.params.resultId
        const deletedResult = await ResultModel.deleteResultById(id)
        res.status(200).send({ payload: 'Result is deleted' })
    }
    catch (error) {
        next(new AppError(error.message));
    }
};


const findByIdAndUpdate = async (req, res, next) => {

    try {
        const id = req.params.resultId
        const model = { ...req.body }
        const updatedResults = await ResultModel.findByIdAndUpdate(id, model)
        res.status(200).send({ payload: { updatedResults } })
    }
    catch (error) {
        next(new AppError(error.message));
    }
};





export { getAllResults, getResultById, addResults, deleteResultById, findByIdAndUpdate }