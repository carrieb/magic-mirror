const RECIPE_DB_URL = 'mongodb://localhost:27017/recipes';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const noop = () => {};

function _connect(error) {
  MongoClient.connect(RECIPE_DB_URL, error);
}

function _documents(callback, error) {
  _connect((err, db) => {
    if (err) error(err);
    const coll = db.collection('documents');
    callback(coll, db);
  });
}

function getAllRecipes(done, error=noop) {
  _documents((coll, db) => {
    coll.find().toArray((err, docs) => {
      if (err) error(err);
      done(docs);
      db.close();
    });
  }, error);
}

function uploadRecipe(recipe, done, error=noop) {
  _documents((coll, db) => {
    coll.insertOne(recipe)
      .then((res) => {
        done(res.insertedId);
        db.close();
      })
  }, error);
}

const RecipesDb = {
  getAllRecipes,
  uploadRecipe
};

module.exports = RecipesDb;
