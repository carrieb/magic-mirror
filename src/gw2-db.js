const url = 'mongodb://localhost:27017/gw2';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment');

const GuildWars2DB = {
  // TODO: connect to db, get inventory, add items
  getLast7DaysOfWallet(callback) {
    const end = moment(); // now
    const start = moment().subtract(7, 'days'); // 7 days ago
    MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);

      // What i want to do:
      // find all in last 7 days
      // group them by day
      // take last entry for a day

      const match = {
        "$match" : {
          "date": {
            "$gte": start.toDate(),
            "$lte": end.toDate()
          }
        }
      };

      const group = {
        "$group": {
          "_id": {
            "month": { "$month" : "$date"},
            "day": { "$dayOfMonth" : "$date" }
          },
          "wallet-records": { "$push" : {wallet: "$wallet", date: "$date"} }
        }
      };

      const sort = {
        "$sort": {
          date: 1
        }
      };

      const project = {
        "$project": {
          "_id": "$_id",
          "wallet": {"$arrayElemAt": ["$wallet-records", -1]}
        }
      }

      const coll = db.collection('wallet-records');
      const cursor = coll.aggregate([ match, sort, group, project ]);
      const res = [];
      cursor.each((err, doc) => {
        assert.equal(null, err);
        if (doc == null) {
          callback(res);
        } else {
          res.push(doc);
        }
      });
    });
  }
}

module.exports = GuildWars2DB;
