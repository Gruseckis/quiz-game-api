import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: false, required: true },
    path: { type: String, unique: true, required: true },
  },
  { timestamps: true },
);

const MediaModel = mongoose.model('Media', mediaSchema);

const save = async model => new MediaModel(model).save();

const getMediaById = async _id => MediaModel.findOne({ _id });

export { save, getMediaById, mediaSchema, MediaModel };
