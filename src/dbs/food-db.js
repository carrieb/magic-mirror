const url = 'mongodb://localhost:27017/food';
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');
const moment = require('moment-timezone');

const assign = require('lodash/assign');
const noop = require('lodash/noop');

// TODO: create a

const FoodDb = {
  updateItem(dbs, item, callback, error=noop) {
    const db = dbs.food;
    const coll = db.collection('items');

    const o_id = new mongo.ObjectID(item._id);
    if (item._id) {
      // TODO: compare what was updated and write to history collection
      // use findAndModify - returns doc *before* update
      // http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndUpdate
      // compare orig with modifications, use for modified fields in history doc
      // only write if there are differences

      coll.updateOne({
        "_id": o_id
      }, {
        "$set": {
          description: item.description.trim(),
          expiration: item.expiration,
          servingSize: item.servingSize,
          quantity: item.quantity,
          category: item.category.trim(),
          zone: item.zone.trim(),
          ndbno: item.ndbno
        }
      })
      .then(callback)
      .catch((err) => {
        console.log(err);
      })
    } else {
      coll.insertOne(item)
        .then(callback)
        .catch((err) => {
          console.log(err);
        })
    }

  },

  removeItem(dbs, id, callback, error=noop) {
    const db = dbs.food;
    const coll = db.collection('items');
    if (id) {
      const o_id = new mongo.ObjectID(id);
      coll.remove({
        "_id": o_id
      }).then(callback);
    } else {
      error()
    }
  },

  storeNewItems(dbs, items, callback, error=noop) {
    const now = moment().tz('America/Chicago').format();
    console.log(items);
    const db = dbs.food;
    const coll = db.collection('items');

    const batch = coll.initializeUnorderedBulkOp();
    // redo this; just insert a new document for this item/price/quantity
    // later we'll add a completed date to each item
    // can query there to see what's good
    // then we should have another coll for info? (expiration, image etc.)

    // TODO: separate cases for item exists/does not exist

    items.forEach((item) => {
      batch
        .find({ description: item.description })
        .upsert()
        .updateOne({
          "$set": item,
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
  },

  updateImage(dbs, foodName, imageUrl, done) {
    const db = dbs.food;
    const coll = db.collection('items');
    coll.updateOne({ description: foodName }, { "$set": { img: imageUrl } }).then((error, result) => {
      //console.log(error);
      //console.log(result);
      done();
    });
  },

  getKitchen(dbs, done, error=noop) {
    const db = dbs.food;
    const coll = db.collection('items');
    coll.find().toArray((err, docs) => {
      if (err) error(err);
      done(docs);
    });
  },

  star(dbs, id, starred, done) {
    const db = dbs.food;
    const coll = db.collection('items');
    console.log(id, starred);
    coll.updateOne({ "_id":  new mongo.ObjectID(id) }, { "$set": { starred: starred } }).then((error, result) => {
      //console.log(error);
      //console.log(result);
      done();
    });
  }
}

module.exports = FoodDb;
