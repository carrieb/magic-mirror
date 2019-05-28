const express = require('express')
const router = express.Router();

const https = require('https');

const Config = require('../src/config.js');

const path = require('path');
const dir = path.dirname(require.main.filename);

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
