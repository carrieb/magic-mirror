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
      const batch = coll.initializeUnorderedBulkOp();
      // redo this; just insert a new document for this item/price/quantity
      // later we'll add a completed date to each item
      // can query there to see what's good
      // then we should have another coll for info? (expiration, image etc.)
      items.forEach((item) => {
        batch
          .find({ description: item.description })
          .upsert()
          .updateOne({
            "$inc": { "quantity": 1 },
            "$push": { "prices": item.price, "importDates" : moment().format('MM/DD/YYYY')}
          });
      });
      batch.execute((err, result) => {
        if (err) error(err);
        else callback(result);
      });
      // check if item (=description) already exists
      // coll.updateMany({
      //   "description": {"$in" : items.map((item) => item.description) }
      // }, {
      //   $set: {description:  }
      // })
      // coll.insertMany(items.map((item) => {
      //   const itemWithDate = assign(item, { date: now });
      //   return itemWithDate;
      // }), (err, r) => {
      //   if (err) error(err);
      //   //console.log(r);
      //   callback();
      // });
    });
  },

  updateImage(foodName, imageUrl, done) {
    MongoClient.connect(url, (err, db) => {
      if (err) error(err);
      const coll = db.collection('items');
      coll.updateOne({ description: foodName }, { "$set": { img: imageUrl } }).then(() => done());
    });
  },

  getKitchen(done, error=noop) {
    MongoClient.connect(url, (err, db) => {
      if (err) error(err);
      const coll = db.collection('items');
      coll.find().toArray((err, docs) => {
        if (err) error(err);
        done(docs);
      });
    });
  }
}

module.exports = FoodDb;
