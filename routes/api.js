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

router.get('/wanikani-queue', (req, res) => {
  WanikaniApi.getStudyQueue(
    (queue) => res.json(queue),
    (err) => res.status(500).send('Failed to get wanikani study queue.')
  );
});

router.get('/wunderlist', (req, res) => {
  WunderlistApi.getLists(
    (lists) => res.json(lists),
    (err) => res.status(500).send('Failed to get wunderlists.')
  );
});

module.exports = router;
