const url = 'mongodb://localhost:27017/food';
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
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

  // TODO: upsert if doesn't exist
  updateItem(item, callback, error=noop) {
    MongoClient.connect(url, (err, db) => {
      if (err) error(err);
      const coll = db.collection('items');
      // TODO: encrypted version of _id? (token)
      if (item._id) {
        // update
        const o_id = new mongo.ObjectID(item._id);
        coll.updateOne({
          "_id": o_id
        }, {
          "$set": {
            description: item.description,
            expiration: item.expiration,
            servingSize: item.servingSize,
            quantity: item.quantity,
            category: item.category
          }
        })
        .then(callback);
      } else {
        coll.insertOne(item)
          .then((res) => {
            callback(res.insertedId);
          });
      }
    }); // end mongo connect
  },

  removeItem(id, callback, error=noop) {
    MongoClient.connect(url, (err, db) => {
      if (err) error(err);
      const coll = db.collection('items');
      if (id) {
        const o_id = new mongo.ObjectID(id);
        coll.remove({
          "_id": o_id
        }).then(callback);
      } else {
        error()
      }
    }); // end mongo connect
  },

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
