import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    correct: [{ type: Number, required: true }], // array of correct answer ID's
    answers: [{ type: String, required: true }], // array of possible answers as strings
    type: { type: String, required: true, enum: ['input', 'checkbox', 'radio', 'textbox'] },
  },
  { timestamps: true }
);
const QuestionModel = mongoose.model('Question', questionSchema);

// save your question to DB
const save = async model => new QuestionModel(model).save();

// this will return all questions
const getAllQuestions = async () => QuestionModel.find();

// get specific question by providing question ID
const getQuestionByID = async _id => QuestionModel.findById(_id);

const getQuestionByQuestionName = async question => QuestionModel.findOne({ question });

// updates question by provided ID
const updateQuestionById = async (_id, update) => QuestionModel.findByIdAndUpdate(_id, update, { new: true });

// delete question by provided ID(only quis owner or admin can delete questions)
const deleteQuestionById = async _id => QuestionModel.findByIdAndDelete(_id);

// delete multiple reccords from array list
const deleteQuestionsFromIdArray = async questionIdArray => QuestionModel.deleteMany({ _id: { $in: questionIdArray } });

export {
  QuestionModel,
  questionSchema,
  save,
  getAllQuestions,
  getQuestionByID,
  updateQuestionById,
  deleteQuestionById,
  getQuestionByQuestionName,
  deleteQuestionsFromIdArray,
};
