const sharp = require('sharp')

const path = require('path')
const dir = path.dirname(require.main.filename);

const Tesseract = require('tesseract.js')
const HebParser = require('./heb-parser');

const extractText = (path) => {
  Tesseract.recognize(path)
      .then(function (result) {
        console.log('successfully got text with Tesseract');
        HebParser.parse(result);
      });
}

const prepareImage = (file) => {
  const outputPath = '/Users/carolyn/projects/magic-mirror/tmp/processed-images/' + file.filename;
  console.log(file.path);
  sharp(file.path)
  .rotate()
  .resize(400, 640)
  .threshold(79)
  .toFile(outputPath, (err, info) => {
    console.log(info);
    extractText(outputPath);
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
