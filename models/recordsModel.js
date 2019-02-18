import mongoose from "mongoose";
const recordSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true, unique: false },
    answers: [{ type: Number, requred: true }]
  },
  { timestamps: true }
);

const RecordModel = mongoose.model("Record", recordSchema);

const save = async model => new RecordModel(model).save();
const getAllRecords = async () => RecordModel.find();
const getRecordById = async _id => RecordModel.findById({ _id });

const updateById = async (recordId, update) =>
  RecordModel.findByIdAndUpdate(recordId, update, { new: true });

const deleteRecordById = async recordId =>
  RecordModel.findByIdAndRemove(recordId);

const getRecordsFromIdArray = async recordId =>
  RefordModel.find({
    recordID: { $in: [mongoose.Types.ObjectId(recordId.map())] }
  });

export { save, getRecordById, updateById, deleteRecordById, getAllRecords };
