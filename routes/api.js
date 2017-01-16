const express = require('express')
const router = express.Router()

const WundergroundApi = require('../src/wunderground-api')

router.get('/weather', (req, res) => {
  WundergroundApi.getCurrentWeather(
    (weather) => res.json(weather),
    (err) => res.status(500).send('Failed to get weather.')
  );
})

module.exports = router
