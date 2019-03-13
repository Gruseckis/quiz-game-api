import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    ownerId: { type: String, unique: false, required: true },
    name: { type: String, unique: false, required: true },
    description: { type: String, unique: false, required: false },
    questions: [{ type: String, unique: false, required: false }],
  },
  { timestamps: true }
);

quizSchema.index({ ownerId: 1, name: 1 }, { unique: true });

const QuizModel = mongoose.model('Quiz', quizSchema);

const save = async model => new QuizModel(model).save();

const getAllQuizzes = async () => QuizModel.find();

const getQuizById = async _id => QuizModel.findById(_id);

const getQuizByName = async name => QuizModel.findOne({ name });

const getQuizzesByOwnerId = async ownerId => QuizModel.find({ ownerId });

const getQuizByQuestionId = async questionId => QuizModel.find({ questions: { $in: questionId } });

const updateQuizById = async (id, model) => QuizModel.findByIdAndUpdate(id, model, { new: true });

const deleteQuizById = async id => QuizModel.findByIdAndDelete(id);

const addQuestionIntoQuiz = async (id, questionId) =>
  QuizModel.findByIdAndUpdate(id, { $push: { questions: questionId } });

export {
  QuizModel,
  quizSchema,
  save,
  getAllQuizzes,
  getQuizById,
  getQuizzesByOwnerId,
  updateQuizById,
  deleteQuizById,
  getQuizByQuestionId,
  addQuestionIntoQuiz,
};

QuizModel.schema
  .path('name')
  .validate(async name => !(await getQuizByName(name.toLowerCase())), 'Quiz already exists!');
