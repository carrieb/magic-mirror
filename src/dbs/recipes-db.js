const RECIPE_DB_URL = 'mongodb://localhost:27017/recipes';
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');

const _noop = require('lodash/noop');
const _has = require('lodash/has');

function getAllRecipes(dbs, done, error=_noop) {
  const db = dbs.recipes;
  const coll = db.collection('documents');
  coll.find().toArray((err, docs) => {
    if (err) error(err);
    done(docs);
  });
}

function getRecipeById(dbs, rawId, done, error=_noop) {
  const db = dbs.recipes;
  const coll = db.collection('documents');
  const id = new mongo.ObjectID(rawId);
  coll.findOne({ '_id': id }, (err, res) => {
    if (err) error(err);
    done(res);
  });
}

function uploadRecipe(dbs, recipe, done, error=noop) {
  const db = dbs.recipes;
  const coll = db.collection('documents');

  if (_has(recipe, '_id')) {
    // perform update
    const rawId = recipe._id;
    const id = new mongo.ObjectID(rawId);
    delete recipe._id;

    coll.updateOne({ '_id' : id }, { '$set': recipe })
      .then((res) => {
        done(rawId);
      })
      .catch(error);
  } else {
    // perform insert
    coll.insertOne(recipe)
      .then((res) => {
        done(res.insertedId);
      })
  }
}

const RecipesDb = {
  getAllRecipes,
  uploadRecipe,
  getRecipeById
};

module.exports = RecipesDb;
