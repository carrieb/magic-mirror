const express = require('express')
const router = express.Router()
const apicache = require('apicache')
let cache = apicache.middleware

const WundergroundApi = require('../src/api/wunderground-api')
const WanikaniApi = require('../src/api/wanikani-api')
const WunderlistApi = require('../src/api/wunderlist-api')
const CalendarApi = require('../src/api/calendar-api')
const GuildWars2Api = require('../src/api/gw2-api')
const USDAFoodApi = require('../src/api/usda-food-api')

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
  // const subtasks = items.map((item) => {
  //   const q = item.quantity || {};
  //   const remainder = q.amount - Math.floor(q.amount);
  //   const whole = q.amount - remainder;
  //   let amt = whole === 0 ? '' : whole + ' ';
  //   if (remainder === .75) { amt += '3/4 '; }
  //   if (remainder === .33) { amt += '1/3 '; }
  //   if (remainder === .25) { amt += '1/4 '; }
  //   if (remainder === .5) { amt += '1/2 '; }
  //   const quantity = `${amt}${q.unit ? q.unit : ''}${(q.amount > 1 && q.unit) ? 's' : ''}`;
  //   return `${quantity}${q.unit ? ' of ' : ''}${item.modifier ? item.modifier + ' ' : ''}${item.name || item.description}`;
  // });
  const subtasks = items.map(item => {
    const unit = item.quantity.unit && item.quantity.unit.length > 0 ? item.quantity.unit : null;
    return `${item.quantity.amount}${unit && ` ${unit}`} ${item.name || item.description}`;
  });
  WunderlistApi.createNewTask(subtasks,
    (json) => res.json(json),
    (err) => res.status(500).send('Failed to export shopping list.')
  );
});

router.get('/calendars', (req, res) => {
  // TODO: update google calendar API
  CalendarApi.getEventsForCalendars(
    (events) => { res.json(events) },
    (err) => { res.status(500).send('Failed to get calendars.') }
  );
});

router.get('/guildwars', cache('1 day'), (req, res) => {
  GuildWars2Api.fetchCombined(
    res.app.locals.dbs,
    (result) => { res.json(result) },
    (err) => { res.status(500).send('Failed to get gw2 result.') }
  );
});

router.get('/guildwars/wallet', cache('1 day'), (req, res) => {
  GuildWars2DB.getLast7DaysOfWallet(
    (result) => res.json(result),
    (err) => res.status(500).send('Failed to get gw2 wallet history.')
  );
});

router.post('/usda/search', jsonParser, (req, res) => {
  USDAFoodApi.searchForFood(req.body.query, (result) => {
    console.log(result);
    res.json(result.list.item);
  }, (error) => {
    res.status(500).send(`Failed to search USDA for '${req.body.query}'`);
  })
});

router.get('/usda/retrieve', (req, res) => {
  USDAFoodApi.retrieveFood(req.query.ndbno, (result) => {
    res.json(result);
  }, (error) => {
    res.status(500).send(`Failed to retrieve from USDA ndbno: ${req.query.ndbno}`);
  });
});

module.exports = router;
