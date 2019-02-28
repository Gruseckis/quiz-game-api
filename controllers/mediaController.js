import * as MediaModel from '../models/MediaModel';
import AppError from '../errors/AppError';
import * as fsHandler from '../utils/fsHandler';
import path from 'path';

const addMedia = async (req, res, next) => {
  const { user } = req;
  const {
    file: { filename },
  } = req;
  try {
    const media = await MediaModel.save({
      userId: user.id,
      path: `/${process.env.IMAGE_UPLOAD_FOLDER}/${filename}`,
    });
    res.status(200).send({
      payload: {
        mediaId: media.id,
        path: media.path,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getMediaById = async (req, res, next) => {
  try {
    const media = await MediaModel.getMediaById(req.params.mediaId);
    res.status(200).send({ payload: { media } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteMediaById = async (req, res, next) => {
  try {
    const media = await MediaModel.deleteMediaById(req.params.mediaId);
    const pathToDir = path.join(__dirname, `../${media.path}`);
    await fsHandler.deleteFile(pathToDir);
    res.status(200).send({ payload: { message: 'Succesfully deleted file' } });
  } catch (error) {
    next(new AppError(error.message));
  }
};

export { addMedia, getMediaById, deleteMediaById };
