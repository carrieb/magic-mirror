const url = 'mongodb://localhost:27017/food';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment-timezone');

const assign = require('lodash/assign');

const noop = () => {};

const FoodDb = {
  // TODO: connect to db, get inventory, add items
  // storage ideas:
  // in food db
  // MVP: each item  { name, date, price }
  // eventually { name, date, quantity, size, expiration, type }
  storeNewItems(items, callback, error=noop) {
    const now = moment().tz('America/Chicago').format();
    console.log(items);
    MongoClient.connect(url, (err, db) => {
      if (err) error(err);
      const coll = db.collection('items');
      coll.insertMany(items.map((item) => {
        const itemWithDate = assign(item, { date: now });
        return itemWithDate;
      }), (err, r) => {
        if (err) error(err);
        //console.log(r);
        callback();
      });
    });
  }
}

module.exports = FoodDb;
