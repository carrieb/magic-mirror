const sharp = require('sharp')

const path = require('path')
const dir = path.dirname(require.main.filename);

const prepareImage = (file) => {
  console.log(file.path);
  sharp(file.path)
  .rotate()
  .resize(400, 640)
  .threshold(79)
  .toFile('/Users/carolyn/projects/magic-mirror/tmp/processed-images/' + file.filename, (err, info) => {
    console.log(info);
  });
}

const ReceiptProcessor = {
  extractItems(file) {
    console.log('extracting..');
    prepareImage(file);
    return [];
  }
}

module.exports = ReceiptProcessor;
