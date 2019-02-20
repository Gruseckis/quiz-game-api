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
const getRecords = async () => RecordModel.find();
const getRecordUsingId = async _id => RecordModel.findById(_id);

const updateById = async (recordId, update) =>
  RecordModel.findByIdAndUpdate(recordId, update, { new: true });

const deleteRecordById = async recordId =>
  RecordModel.findByIdAndDelete(recordId);

const getRecordsFromIdArray = async arrayId => {
  RecordModel.find({ _id: { $in: [arrayId] } });
};

export {
  RecordModel,
  recordSchema,
  save,
  getRecordUsingId,
  updateById,
  deleteRecordById,
  getRecords,
  getRecordsFromIdArray
};
