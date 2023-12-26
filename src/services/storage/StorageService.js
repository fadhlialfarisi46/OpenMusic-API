const fs = require('fs');

class StorageService {
  constructor(directory) {
    this._folder = directory;

    this.ensureDirExistence();
  }

  writeFile(file, meta) {
    const filename = `${+new Date()}${meta.filename}`;
    const path = `${this._folder}/${filename}`;

    this.ensureDirExistence();
    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  getDirectory() {
    return this._folder;
  }

  ensureDirExistence(directory = this._folder) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }
}

module.exports = StorageService;
