const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');

const _noop = require('lodash/noop');
const _has = require('lodash/has');

function createOrUpdateMeal(dbs, meal) {
  const coll = dbs.meals.collection('documents');

  if (meal._id) {
    // update meal
  } else {
    // create meal
  }
}

function getMeal(dbs, id) {
  const coll = dbs.meals.collection('documents');
  const o_id = new mongo.ObjectID(id);
  return coll.findOne(o_id);
}

module.exports = {
  createOrUpdateMeal,
  getMeal
};
