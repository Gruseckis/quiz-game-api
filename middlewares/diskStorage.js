import multer from 'multer';
import path from 'path';
import * as fsHandler from '../utils/fsHandler';
import AppError from '../errors/AppError';

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    const pathToDir = path.join(__dirname, `../${process.env.IMAGE_UPLOAD_FOLDER}`);
    await fsHandler.createFolderIfNotExists(pathToDir);
    cb(null, pathToDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match('image/*')) {
      return cb(new AppError('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

export const diskStorageSingle = upload.single('media');