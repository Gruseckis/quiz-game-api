import mongoose from "mongoose";
const recordSchema = new mongoose.Schema(
  {
    recordID: { type: String, unique: true, required: true },
    questionID: { type: String, required: true, unique: false },
    answers: [Number]
  },
  { timestamps: true }
);

const RecordModel = mongoose.model("Record", recordSchema);

const save = async model => new RecordModel(model).save();
const getAllRecords = async () => RecordModel.find();
const getRecordById = async recordId => RecordModel.findOne(recordId);
const updateRecordById = async recordId =>
  RecordModel.findOneAndUpdate(recordId);
const deleteRecordById = async recordId => RecordModel.remove({ recordId });

// What acctual data we need to handle throuw
const getRecordsFromIdArray = async recordId =>
  RefordModel.find({
    recordID: { $in: [mongoose.Types.ObjectId(recordId).map()] }
  });

export {
  save,
  getRecordById,
  updateRecordById,
  deleteRecordById,
  getRecordsFromIdArray,
  getAllRecords
};
