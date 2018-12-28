const express = require('express')
const router = express.Router();

const https = require('https');

const Config = require('../src/config.js');

const path = require('path')
const dir = path.dirname(require.main.filename);

const multer  = require('multer')
const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir + '/tmp/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const receiptUpload = multer({ storage: receiptStorage });

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const CalendarApi = require('../src/api/calendar-api');

router.get('/google-auth', (req, res) => {
  res.redirect(CalendarApi.generateAuthUrl() + "&prompt=consent");
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

router.get(['/kitchen', '/kitchen/*'], (req, res) => {
  res.sendFile(dir + '/views/kitchen.html');
});

router.get(['/recipes', '/recipes/*'], (req, res) => {
  res.sendFile(dir + '/views/recipes.html');
});

router.get(['/meals', '/meals/*', '/meal', '/meal/*'], (req, res) => {
  res.sendFile(dir + '/views/meals.html');
});

router.post('/receipt', receiptUpload.single('receipt'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  const items = ReceiptProcessor.extractItems(req.file);
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

const AlertsApi = require('../src/api/alerts-api');

router.post('/firebase-token', jsonParser, (req, res) => {
  const deviceId = req.body.token;
  AlertsApi.registerDevice(deviceId, (response) => {
    res.send('OK');
  }, (error) => {
    res.status(500).send(`Something went wrong when registering your device.`);
  });
});

router.get('/', (req, res) => {
  res.sendFile(dir + '/views/index.html');
});

module.exports = router
