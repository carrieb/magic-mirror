const sharp = require('sharp')

const path = require('path')
const dir = path.dirname(require.main.filename);

const Tesseract = require('tesseract.js')
const HebParser = require('./heb-parser');

const jsonfile = require('jsonfile')
const fs = require('fs')

const saveTessaractOutput = (filename, obj) => {
  const outputPath = '/Users/carolyn/projects/magic-mirror/tmp/tesseract-output/' + filename + '.json';
  jsonfile.writeFile(outputPath, obj.lines.map((line) => {
    return {
      text: line.text.trim()
    }
  }), function (err) {
    console.error(err)
  });
}

const extractText = (filename) => {
  // TODO: look up these dirs from somewhere 
  const fullPath = '/Users/carolyn/projects/magic-mirror/tmp/processed-images/' + filename;
  const jsonPath = '/Users/carolyn/projects/magic-mirror/tmp/tesseract-output/' + filename + '.json';
  fs.stat(jsonPath, (err, stats) => {
    console.log(err, stats);
    if (err) {
      // doesn't exist, do processing
      Tesseract.recognize(fullPath)
          .then(function (result) {
            saveTessaractOutput(filename, result);
            console.log('successfully got text with Tesseract');
            HebParser.parseTessaract(result);
          });
    } else {
      // read file and parse
      jsonfile.readFile(jsonPath, (err, obj) => {
        HebParser.parseTextObj(obj);
      });
    }
  })

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
    extractText(file.filename);
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
