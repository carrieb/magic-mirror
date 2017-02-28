const express = require('express')
const router = express.Router()

const Config = require('../src/config.js');

const path = require('path')
const dir = path.dirname(require.main.filename);

const multer  = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir + '/tmp/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({ storage });

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// GOOGLE

const CalendarApi = require('../src/api/calendar-api');
const FoodDb = require('../src/food-db.js');

router.get('/google-auth', (req, res) => {
  res.redirect(CalendarApi.generateAuthUrl());
});

router.get('/google-auth-callback', (req, res) => {
  CalendarApi.getNewToken(req.query.code, () => {
    //CalendarApi.retrieveCalendarsAndEvents();
    res.redirect('/');
  });
});

// RECEIPTS

const ReceiptProcessor = require('../src/receipt-processor');

router.get(['/process-receipt', '/process-receipt/*'], (req, res) => {
  // TODO: this won't work, update __dirname
  res.sendFile(dir + '/views/upload-receipt.html')
});

router.post('/receipt', upload.single('receipt'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  const items = ReceiptProcessor.extractItems(req.file);
  res.redirect(`/process-receipt/crop/${req.file.filename}`);
});

router.post('/crop', jsonParser, (req, res) => {
  console.log(req.body);
  // TODO: get image, crop using req.body, rotate right, save in tmp/processed-images
  ReceiptProcessor.cropAndProcess(req.body.filename, req.body.x, req.body.y, req.body.width, req.body.height, req.body.rotate);
  res.send('OK');
});

router.get('/extract', (req, res) => {
  ReceiptProcessor.extractText(req.query.filename, (items) => {
    res.send(items);
  });
});

router.post('/items', jsonParser, (req, res) => {
  // TODO: store new things into DB
  FoodDb.storeNewItems(req.body.items, () => {
    res.send('OK');
  });
});

router.get('/', (req, res) => {
  res.sendFile(dir + '/views/index.html');
});

module.exports = router
