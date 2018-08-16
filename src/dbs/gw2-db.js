const url = 'mongodb://localhost:27017/gw2';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment-timezone');

const GuildWars2DB = {
  // TODO: connect to db, get inventory, add items
  getLast7DaysOfWallet(callback, error) {
    const end = moment(); // now
    const start = moment().subtract(7, 'days'); // 7 days ago

    MongoClient.connect(url, (err, db) => {
      if (err) error(err);

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

      const sort = {
        "$sort": {
          date: -1
        }
      };

      const group = {
        "$group": {
          "_id": {
            "month": { "$month" : "$date"},
            "day": { "$dayOfMonth" : "$date" }
          },
          "wallet": { "$first" : "$wallet" },
          "date": { "$first" : "$date" }
        }
      };

      const project = {
        "$project": {
          "_id": 0,
          "date": "$date",
          "wallet": "$wallet"
        }
      };

      const finalSort = {
        "$sort" : {
          "date": 1
        }
      };

      const coll = db.collection('wallet-records');
      const cursor = coll.aggregate([ match, sort, group, project, finalSort ]);
      const res = [];
      cursor.each((err, doc) => {
        if (err) error(err);
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
