const express = require('express')
const router = express.Router();

const Config = require('../src/config.js');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const RecipesDb = require('../src/dbs/recipes-db');

router.get('/', (req, res) => {
  RecipesDb.getAllRecipes(res.app.locals.dbs, (recipes) => {
    res.json(recipes);
  }, (err) => res.status(500).send(`Failed to retrieve recipes. ${err.message}`));
});

router.get('/:id', (req, res) => {
  RecipesDb.getRecipeById(res.app.locals.dbs, req.params.id, (recipe) => {
    res.json(recipe);
  }, (err) => res.status(500).send(`Failed to retrieve recipe with id [${req.params.id}]`));
});

module.exports = router;
