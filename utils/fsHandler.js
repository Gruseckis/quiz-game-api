import fs from 'fs';

const createFolderIfNotExists = path => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, err => {
      if (err) {
        if (err.code === 'EEXIST') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
};

const deleteFile = path => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
}

export { createFolderIfNotExists, deleteFile };
