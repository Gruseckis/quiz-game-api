import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    ownerId: { type: String, unique: false, required: true },
    name: { type: String, unique: true, required: true },
    questions: [{ type: String, unique: false, required: false }]
  },
  { timestamps: true }
);

const QuizModel = mongoose.model('Quiz', quizSchema);

const save = async model => new QuizModel(model).save();

const getAllQuizzes = async () => QuizModel.find();

const getQuizById = async _id => QuizModel.findOne({ _id });

const getQuizzesByOwnerId = async ownerId => QuizModel.find({ ownerId });

const updateQuizById = async (id, model) => QuizModel.findByIdAndUpdate(id, model);

const deleteQuizById = async id => QuizModel.findByIdAndDelete(id);

export { quizSchema, save, getAllQuizzes, getQuizById, getQuizzesByOwnerId, updateQuizById, deleteQuizById };