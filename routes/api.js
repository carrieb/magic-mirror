const express = require('express')
const router = express.Router()

const WundergroundApi = require('../src/api/wunderground-api')
const WanikaniApi = require('../src/api/wanikani-api')
const WunderlistApi = require('../src/api/wunderlist-api')
const CalendarApi = require('../src/api/calendar-api')
const GuildWars2Api = require('../src/gw2-api')

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

router.get('/calendars', (req, res) => {
  CalendarApi.retrieveCalendarsAndEvents(
    (calendars) => res.json(calendars),
    (err) => res.status(500).send('Failed to get calendars.')
  );
});

router.get('/guildwars', (req, res) => {
  GuildWars2Api.fetchCombined(
    (result) => res.json(result),
    (err) => res.status(500).send('Failed to get gw2 result.')
  );
});

module.exports = router;
