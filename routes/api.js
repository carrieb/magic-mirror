const express = require('express')
const router = express.Router()

const WundergroundApi = require('../src/wunderground-api')
const WanikaniApi = require('../src/wanikani-api')
const WunderlistApi = require('../src/wunderlist-api')

router.get('/weather', (req, res) => {
  WundergroundApi.getCurrentWeather(
    (weather) => res.json(weather),
    (err) => res.status(500).send('Failed to get weather.')
  );
});

router.get('/forecast', (req, res) => {
  WundergroundApi.getForecast(
    (forecast) => res.json(forecast),
    (err) => res.status(500).send('Failed to get forecast.')
  );
});

router.get('/wanikani', (req, res) => {
  WanikaniApi.getCombinedData(
    (data) => res.json(data),
    (err) => res.status(500).send('Failed to get wanikani combined data.')
  );
});

router.get('/wunderlist', (req, res) => {
  WunderlistApi.getLists(
    (lists) => res.json(lists),
    (err) => res.status(500).send('Failed to get wunderlists.')
  );
});

module.exports = router;
