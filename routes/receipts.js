const express = require('express');
const router = express.Router();
const path = require('path');

const Config = require('../src/config.js');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const multer  = require('multer')
const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Config.RECEIPT_IMAGES_DIR + '/raw')
  },

  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const receiptUpload = multer({ storage: receiptStorage });

const ReceiptProcessor = require('../src/receipt-processor');

router.post('/upload', receiptUpload.single('receipt'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  // const items = ReceiptProcessor.extractItems(req.file);
  res.redirect(`/process-receipt/crop/${req.file.filename}`);
});

router.post('/crop', jsonParser, (req, res) => {
  console.log(req.body);
  // TODO: get image, crop using req.body, rotate right, save in tmp/processed-images
  ReceiptProcessor.cropAndProcess(req.body.filename, req.body.x, req.body.y, req.body.width, req.body.height, req.body.rotate, () => {
    res.send('OK');
  }, () => {
    res.state(404).send(`Failed to crop ${req.query.filename}.`);
  });
});

router.get('/extract', (req, res) => {
  ReceiptProcessor.extractText(req.query.filename, (items) => {
    res.send(items);
  }, () => {
    res.status(404).send(`A processed image for ${req.query.filename} not found.`);
  });
});

router.post('/items', jsonParser, (req, res) => {
  // TODO: either add or update items in db
  // record price history
  // record shopping trip?
});

module.exports = router;
