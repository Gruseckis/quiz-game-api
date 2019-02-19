import mongoose from 'mongoose';
const recordSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true, unique: false },
    answers: [{ type: String, required: true }]
  },
  { timestamps: true }
);

const RecordModel = mongoose.model('Record', recordSchema);

const save = async model => new RecordModel(model).save();
const getAllRecords = async () => RecordModel.find();
const getRecordById = async _id => RecordModel.findById(_id);

const updateById = async (recordId, update) =>
  RecordModel.findByIdAndUpdate(recordId, update, { new: true });

const deleteRecordById = async recordId =>
  RecordModel.findByIdAndDelete(recordId);

const getRecordsFromIdArray = async arrId => {
  RecordModel.find({ _id: { $in: [arrId] } });
};

export {
  RecordModel,
  recordSchema,
  save,
  getRecordById,
  updateById,
  deleteRecordById,
  getAllRecords,
  getRecordsFromIdArray
};
