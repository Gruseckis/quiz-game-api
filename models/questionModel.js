import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
   {
      "question": { type: String, required: true },
      "correct": [ {type: String, required: true } ], // array of correct answer ID's 
      "answers": [ {type: String, required: true } ], // array of possible answers as strings
      "type": { type: String, required: true, enum: ['input', 'checkout', 'radio', 'textbox']}
   },
   { timestamps: true },
);

const QuestionModel = mongoose.model('Question', questionSchema);

// save your question to DB
const save = async model => new QuestionModel(model).save();

// this will return all questions
const getAllQuestions = async () => QuestionModel.find();

// get specific question by providing question ID
const getQuestionByID = async _id => QuestionModel.findById(_id);

// updates question by provided ID
const updateQuestionByID = async (_id, update) => QuestionModel.findByIdAndUpdate(_id, update, {new: true });

// delete question by provided ID(only quis owner or admin can delete questions)
const deleteQuestionByID = async _id => QuestionModel.findByIdAndDelete(_id);

export  { QuestionModel, questionSchema, save, getAllQuestions, getQuestionByID, updateQuestionByID, deleteQuestionByID };