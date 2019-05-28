const sharp = require('sharp')

const path = require('path')
const dir = path.dirname(require.main.filename);

const Tesseract = require('tesseract.js')

const worker = new Tesseract.TesseractWorker({
  langPath: 'https://tessdata.projectnaptha.com/4.0.0'
});

const HebParser = require('./heb-parser');

const jsonfile = require('jsonfile')
const fs = require('fs')

const Config = require('./config');

const saveJSONFile = (outputPath, content) => {
  jsonfile.writeFile(outputPath, content, (err) => console.error('error', err));
}

const saveTesseractOutput = (filename, obj) => {
  const outputPath = path.join(Config.RECEIPT_IMAGES_DIR, 'tesseract-output', filename + '.json');
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
  const fullPath = path.join(Config.RECEIPT_IMAGES_DIR, 'processed', filename);
  const jsonPath = path.join(Config.RECEIPT_IMAGES_DIR, 'tesseract-output', filename + '.json');

  fs.stat(jsonPath, (err, stats) => {
    if (err) {
      // doesn't exist, do processing
      worker.recognize(fullPath)
          .then(function (result) {
            saveTesseractOutput(filename, result);
            console.log('Successfully extracted with Tesseract');
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
  const outputPath = path.join(Config.RECEIPT_IMAGES_DIR, 'processed', file.filename);
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

  /**
   * @param filename
   * @param x
   * @param y
   * @param width
   * @param height
   * @param rotate
   * @param callback
   * @param error
   * Takes input image at /raw/filename
   * Rotates and crops based off x, y, width, height & rotate
   * Resizes to 600
   * Saves to /processed/filename
   */
  cropAndProcess(filename, x, y, width, height, rotate, callback, error) {
    const inputPath = path.join(Config.RECEIPT_IMAGES_DIR, 'raw', filename);
    const outputPath = path.join(Config.RECEIPT_IMAGES_DIR, 'processed', filename);

    // TODO: trigger a python processing script?
    // OR: update threshold to be around 40? (based on python otsu/iso/min)
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

  /**
   * @param filename
   * @param callback
   * @param error
   * Checks for existing extracted text at /tesseract-output/filename
   * If it doesn't exist
   * Takes image at /processed/filename
   * And sends through Tesseract
   * Saves output to /tesseract-output/filename
   */
  extractText(filename, callback, error) {
    const inputPath = path.join(Config.RECEIPT_IMAGES_DIR, 'processed', filename);
    const jsonOutputPath = path.join(Config.RECEIPT_IMAGES_DIR, 'tesseract-output', filename + '.json');

    console.log('Extracting text...');
    console.log(`input: ${inputPath}`);
    console.log(`output: ${jsonOutputPath}`);

    fs.stat(jsonOutputPath, (err, stats) => {
      if (err) {
        // tesseract output doesn't already exist, do processing
        // ensure that processed image exists first
        fs.stat(inputPath, (err, stats) => {
          if (err) error();
          else {
            worker.recognize(inputPath)
            .then((result) => {
              saveTesseractOutput(filename, result);
              console.log('successfully extracted with Tesseract');
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
  },

  runTessaractOnce(path, outputPath, callback, error) {
    fs.stat(outputPath, (err, stats) => {

      if (err) {
        Tesseract
        .recognize(path)
        .progress((p) => console.log('progress', p))
        .catch(err => console.error('error', err))
        .then((result) => {
          console.log('Successfully got text with Tesseract');
          const minified = result.lines.map((line) => {
            return { text: line.text.trim() }
          });
          saveJSONFile(outputPath, minified);
          callback(minified);
        });

      } else {

        jsonfile.readFile(outputPath, (err, obj) => {
          callback(obj);
        });

      }

    });
  }
}

module.exports = ReceiptProcessor;
