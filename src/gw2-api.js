const RequestWrapper = require('./request-wrapper')

const PropertiesReader = require('properties-reader')
const properties = PropertiesReader('/Users/carolyn/projects/magic-mirror/config/gw2.properties')

const MongoClient = require('mongodb').MongoClient
const mongo_url = 'mongodb://localhost:27017/gw2';

const assign = require('lodash/assign')
const assert = require('assert')

const hostname = 'api.guildwars2.com'
const api_path = '/v2'
const auth_path = `?access_token=${properties.get('api.key')}`
const currencies_path = (id) => `${api_path}/currencies/${id}`
const wallet_path = api_path + '/account/wallet' + auth_path;
const daily_achievements_path = api_path + '/achievements/daily';

const currencyIndex = {}

const GuildWars2Api = {
  fetchDailyAchievements(done, err) {
    RequestWrapper.getJSON(hostname, daily_achievements_path, done, err);
  },

  fetchCurrency(id, done, err) {
    if (currencyIndex.hasOwnProperty(id)) {
      done(currencyIndex[id]);
    } else {
      RequestWrapper.getJSON(hostname, currencies_path(id), (currency) => {
        currencyIndex[id] = currency;
        done(currency)
      }, err);
    }
  },

  fetchWallet(done, err) {
    RequestWrapper.getJSON(hostname, wallet_path, (wallet) => {
      this.saveWalletRecord(wallet);
      done(wallet);
    }, err);
  },

  fetchWalletWithMetadata(done, err) {
    let res = []
    this.fetchWallet((wallet) => {
      this.saveWalletRecord(wallet);
      res = wallet;
      let updated = 0;
      const toUpdate = wallet.length;
      wallet.forEach((currency, idx) => {
        this.fetchCurrency(currency.id, (metadata) => {
          res[idx] = assign(res[idx], metadata);
          updated++;
          if (updated === toUpdate) {
            done(res);
          }
        }, err);
      });
    }, err);
  },

  saveWalletRecord(wallet) {
    MongoClient.connect(mongo_url, function(err, db) {
      assert.equal(null, err);
      const coll = db.collection('wallet-records');
      const obj = {
        wallet,
        date: new Date()
      }
      coll.insert(obj, (err, res) => {
        assert.equal(null, err);
        db.close();
      });
    });
  }
}

module.exports = GuildWars2Api;
