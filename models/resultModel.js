import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({

    recordId: { type: [String], unique: true, required: true },
    userId: { type: String, unique: true, required: true },
    quizId: { type: String, unique: true, required: true },
},
    { timestamps: true },
);


const ResultModel = mongoose.model('Result', resultSchema);

const save = async model => new ResultModel(model).save();


const getAllResults = async () => ResultModel.find();

const getResultById = async _id => ResultModel.findById(_id);

const getAllResultsByUserId = async userId => ResultModel.find(userId);

const getAllresultsByQuizId = async quizId => ResultModel.find(quizId);

const findByIdAndUpdate = async (id, model) => ResultModel.findByIdAndUpdate(id, model, { new: true });

const deleteResultById = async _id => ResultModel.findByIdAndRemove(_id);


export { save, getAllResults, getResultById, getAllResultsByUserId, getAllresultsByQuizId, deleteResultById, ResultModel, resultSchema, findByIdAndUpdate };
