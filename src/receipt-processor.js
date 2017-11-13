const sharp = require('sharp')

const path = require('path')
const dir = path.dirname(require.main.filename);

const Tesseract = require('tesseract.js')
const HebParser = require('./heb-parser');

const jsonfile = require('jsonfile')
const fs = require('fs')

const Config = require('./config');

const saveTessaractOutput = (filename, obj) => {
  const outputPath = path.join(Config.getBaseDir(), 'tmp', 'tesseract-output', filename + '.json');
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
    extractText(file.filename);
  });
}

const ReceiptProcessor = {
  extractItems(file) {
    console.log('extracting..');
    prepareImage(file);
    return [];
  },

  cropAndProcess(filename, x, y, width, height, rotate, callback, error) {
    const inputPath = path.join(Config.getBaseDir(), 'tmp', 'images', filename);
    const outputPath = path.join(Config.getBaseDir(), 'tmp', 'processed-images', filename);
    fs.stat(inputPath, (err, stats) => {
      if (err) error();
      else {
        sharp(inputPath)
          .rotate(rotate)
          .extract({left: x, top: y, width, height})
          .resize(600)
          //.threshold(79)
          .toFile(outputPath, (err, info) => {
            console.log(err);
            if (err) error();
            else {
              callback();
            }
          });
      }
    });
  },

  extractText(filename, callback, error) {
    console.log(filename);
    const inputPath = path.join(Config.getBaseDir(), 'tmp', 'processed-images', filename);
    const jsonOutputPath = path.join(Config.getBaseDir(), 'tmp', 'tesseract-output', filename + '.json');
    console.log(`input: ${inputPath}`);
    console.log(`output: ${jsonOutputPath}`);
    fs.stat(jsonOutputPath, (err, stats) => {
      if (err) {
        //output doesn't already exist, do processing
        //ensure that processed image exists first
        fs.stat(inputPath, (err, stats) => {
          if (err) error();
          else {
            Tesseract.create({ langPath: '/Users/carolyn/projects/magic-mirror/'})
            .recognize(inputPath)
            .then((result) => {
              saveTessaractOutput(filename, result);
              console.log('successfully got text with Tesseract');
              const items = HebParser.parseTessaract(result);
              callback(items);
            });
          }
        });
      } else {
        // read file and parse
        jsonfile.readFile(jsonOutputPath, (err, obj) => {
          const items = HebParser.parseTextObj(obj);
          callback(items);
        });
      }
    });
  }
}

module.exports = ReceiptProcessor;
