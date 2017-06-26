const url = 'mongodb://localhost:27017/recipes';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const noop = () => {};

const getRecipes = (done, error=noop) => {
  MongoClient.connect(url, (err, db) => {
    if (err) error(err);
    const coll = db.collection('documents');
    coll.find().toArray((err, docs) => {
      if (err) error(err);
      done(docs);
    });
  });
}

const RecipesDb = {
  getRecipes
}

export default RecipesDb;
