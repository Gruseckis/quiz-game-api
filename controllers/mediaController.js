import * as MediaModel from '../models/MediaModel';
import AppError from '../errors/AppError';

const addMedia = async (req, res, next) => {
  const { user } = req;
  const { file: { filename } } = req;
  try {
    const media = await MediaModel.save({
      userId: user.id,
      path: `/${process.env.IMAGE_UPLOAD_FOLDER}/${filename}`
    });
    res.status(200).send({
      payload: {
        mediaId: media.id,
        path: media.path,
      }
    });
  } catch (error) {
    next(new AppError(error.message));
  }
}

export { addMedia };