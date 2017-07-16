const express = require('express')
const router = express.Router()
const apicache = require('apicache')
let cache = apicache.middleware

const WundergroundApi = require('../src/api/wunderground-api')
const WanikaniApi = require('../src/api/wanikani-api')
const WunderlistApi = require('../src/api/wunderlist-api')
const CalendarApi = require('../src/api/calendar-api')
const GuildWars2Api = require('../src/api/gw2-api')

const GuildWars2DB = require('../src/gw2-db')
const FoodDb = require('../src/food-db');

router.get('/weather', cache('1 day'), (req, res) => {
  WundergroundApi.getCurrentWeather(
    (weather) => res.json(weather),
    (err) => res.status(500).send('Failed to get weather.')
  );
});

router.get('/forecast', cache('1 day'), (req, res) => {
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
    (calendarsWithEvents) => res.json(calendarsWithEvents),
    (err) => res.status(500).send('Failed to get calendars.')
  );
});

router.get('/guildwars', cache('1 day'), (req, res) => {
  GuildWars2Api.fetchCombined(
    (result) => res.json(result),
    (err) => res.status(500).send('Failed to get gw2 result.')
  );
});

router.get('/guildwars/wallet', cache('1 day'), (req, res) => {
  GuildWars2DB.getLast7DaysOfWallet(
    (result) => res.json(result),
    (err) => res.status(500).send('Failed to get gw2 wallet history.')
  );
});

router.get('/kitchen', (req, res) => {
  FoodDb.getKitchen(
    (result) => res.json(result),
    (err) => res.status(500).send('Failed to get kitchen.')
  );
});

module.exports = router;
