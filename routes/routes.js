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

const foodImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir + '/tmp/food-images')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.filename + path.extname(file.originalname));
  }
});
const foodImageUpload = multer({ storage: foodImageStorage })

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// GOOGLE

const CalendarApi = require('../src/api/calendar-api');
const FoodDb = require('../src/food-db.js');

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

router.post('/receipt', receiptUpload.single('receipt'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  const items = ReceiptProcessor.extractItems(req.file);
  res.redirect(`/process-receipt/crop/${req.file.filename}`);
});

router.put('/food-item', jsonParser, (req, res) => {
  console.log(req.body.item);
  FoodDb.updateItem(req.body.item, () => res.send('OK'));
});

router.post('/food-image', foodImageUpload.single('image'), function (req, res, next) {
  //console.log(req.file);
  //console.log(req.body);
  FoodDb.updateImage(req.body.filename, req.file.filename, () => {
    res.send(req.file.filename);
  });
  // TODO: save name into db lookup using req.body.filename and set to req.file.filename
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
  // TODO: store new things into DB
  FoodDb.storeNewItems(req.body.items, () => {
    res.send('OK');
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
