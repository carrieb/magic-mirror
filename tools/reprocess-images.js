const ReceiptProcessor = require('../src/receipt-processor')
const fs = require('fs');

const path = require('path')
const dir = path.dirname(require.main.filename);

const IMAGES_DIR = '/Users/carolyn/projects/magic-mirror/tmp/images/';

fs.readdir(IMAGES_DIR, (err, files) => {
  files.forEach(filename => {
    if (filename !== '.DS_Store') {
      ReceiptProcessor.extractItems({
        path: IMAGES_DIR + filename,
        filename
      });
    }
  });
})
