const ReceiptProcessor = require('../src/receipt-processor');
const fs = require('fs');
const readline = require('readline');
const lev = require('fast-levenshtein');
const _mean = require('lodash/mean');

// Be sure to run this from the home directory. For some reason it can't find the
// trained data otherwise.

const inputDir = '/Users/carolyn/projects/magic-mirror/test-data/receipts/heb/out/';
const expectedDir = '/Users/carolyn/projects/magic-mirror/test-data/receipts/heb/expected-text/';
const outDir = '/Users/carolyn/projects/magic-mirror/test-data/receipts/heb/tesseract-out/';

const mins = {};
const otsus = {};
const isos = {};

console.log('Reading image data from ' + inputDir);
fs.readdir(inputDir, (err, files) => {
  const toProcess = files.length;
  let processed = 0;
  files.forEach((file, i) => {
    console.log('Running tessract on ' + file);
    let dists;
    if (file.startsWith('iso')) {
      isos[file] = [];
      dists = isos[file];
    }

    if (file.startsWith('min')) {
      mins[file] = [];
      dists = mins[file];
    }

    if (file.startsWith('otsu')) {
      otsus[file] = [];
      dists = otsus[file];
    }

    const inputPath = inputDir + file;
    const outputPath = outDir + file.replace('jpg', 'json');
    const expectedPath = expectedDir + file.replace('jpg', 'txt').replace('min-', '').replace('iso-', '').replace('otsu-', '')

    ReceiptProcessor.runTessaractOnce(inputPath, outputPath, (result) => {
      const lines = result;

      var lineReader = require('readline').createInterface({
        input: fs.createReadStream(expectedPath)
      });

      let i = 0;

      lineReader.on('line', (line) => {
        let actual;
        if (i > lines.length - 1) {
          console.log('More lines than expected :(');
          actual = '';
        } else {
          actual = lines[i].text;
        }

        const dist = lev.get(line, actual)

        console.log(`[${i}] expected: ${line}`);
        console.log(`[${i}]   actual: ${actual}`);
        console.log(`[${i}]      lev: ${dist}`)

        dists.push(dist)

        i++;
      });

      // TODO: check here if we're completley done, call callback to finish and print out averages
      lineReader.on('close', () => {
        processed++;
        if (processed === toProcess) {
          console.log('min');
          Object.values(mins).forEach((dists) => {
            console.log(dists)
            console.log(_mean(dists))
          })
          console.log('iso');
          Object.values(isos).forEach((dists) => {
            console.log(dists)
            console.log(_mean(dists))
          })
          console.log('otsu');
          Object.values(otsus).forEach((dists) => {
            console.log(dists)
            console.log(_mean(dists))
          })
        }
      });
    });
  });
});
