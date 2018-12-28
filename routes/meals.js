const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const MealsDAO = require('../src/dbs/meals-db');

router.post('/', jsonParser, (req, res) => {
  const meal = req.body.meal;
  MealsDAO.createOrUpdateMeal(res.app.locals.dbs, meal).then(
    (id) => res.json(id),
    (err) => res.status(500).send(`Error: ${err.message}`)
  );
});

router.get('/meal', jsonParser, (req, res) => {
  const id = req.query.id;
  MealsDAO.getMeal(res.app.locals.dbs, id).then(
    (meal) => res.json(meal),
    (err) => res.status(500).send(`Error: ${err.message}`)
  );
})

module.exports = router;
