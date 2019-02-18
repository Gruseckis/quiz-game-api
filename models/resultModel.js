import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({

    recordIds: {
        recordId: { type: Array, unique: true, required: true },
        path: { type: String, unique: true, required: true },
    },
    userId: {
        userId: { type: String, unique: true, required: true },
        path: { type: String, unique: true, required: true },
    },
    quizId: {
        quizId: { type: String, unique: true, required: true },
        path: { type: String, unique: true, required: true },
    },
},
    { timestamps: true },
);


const ResultModel = mongoose.model('Result', resultSchema);

const save = async model => new ResultModel(model).save();


const getAllResults = async () => ResultModel.find();

const getResultById = async _id => ResultModel.findById({ _id });

const getAllResultsByUserId = async userId => ResultModel.find({ userId });

const getAllresultsByQuizId = async quizId => ResultModel.findOne({ quizId });

const updateResultById = async _id => ResultModel.findById({ _id });

const deleteResultById = async _id => ResultModel.deleteResultById({ _id });


export { save, getAllResults, getResultById, getAllResultsByUserId, getAllresultsByQuizId, updateResultById, deleteResultById, ResultModel, resultSchema };