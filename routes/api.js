const express = require('express')
const router = express.Router()
const apicache = require('apicache')
let cache = apicache.middleware

const WundergroundApi = require('../src/api/wunderground-api')
const WanikaniApi = require('../src/api/wanikani-api')
const WunderlistApi = require('../src/api/wunderlist-api')
const CalendarApi = require('../src/api/calendar-api')
const GuildWars2Api = require('../src/api/gw2-api')

const GuildWars2DB = require('../src/dbs/gw2-db');
const RecipesDb = require('../src/dbs/recipes-db');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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

router.post('/export/shopping-list', jsonParser, (req, res) => {
  const items = req.body.items;
  const subtasks = items.map((item) => {
    const q = item.quantity || {};
    const remainder = q.amount - Math.floor(q.amount);
    const whole = q.amount - remainder;
    let amt = whole === 0 ? '' : whole + ' ';
    if (remainder === .75) { amt += '3/4 '; }
    if (remainder === .33) { amt += '1/3 '; }
    if (remainder === .25) { amt += '1/4 '; }
    if (remainder === .5) { amt += '1/2 '; }
    const quantity = `${amt}${q.unit ? q.unit : ''}${(q.amount > 1 && q.unit) ? 's' : ''}`;
    return `${quantity}${q.unit ? ' of ' : ''}${item.modifier ? item.modifier + ' ' : ''}${item.name || item.description}`;
  });
  WunderlistApi.createNewTask(subtasks,
    (json) => res.json(json),
    (err) => res.status(500).send('Failed to export shopping list.')
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

router.post('/recipe', jsonParser, (req, res) => {
  RecipesDb.uploadRecipe(req.body.recipe, (id) => {
    // TODO: obfuscate somehow
    res.json(id);
  }, (err) => res.status(500).send('Failed to upload recipe.'))
});

module.exports = router;
