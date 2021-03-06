const RequestWrapper = require('../request-wrapper')

const Config = require('../config');
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader(Config.getConfigDir() + 'gw2.properties')

const MongoClient = require('mongodb').MongoClient
const mongo_url = 'mongodb://localhost:27017/gw2';

const assign = require('lodash/assign')
const assert = require('assert')
const _find = require('lodash/find')

const moment = require('moment')

const hostname = 'api.guildwars2.com'
const api_path = '/v2'
const auth_path = `?access_token=${properties.get('api.key')}`
const currencies_path = (ids) => `${api_path}/currencies?ids=${ids.join(',')}`
const wallet_path = api_path + '/account/wallet' + auth_path;
const daily_achievements_path = api_path + '/achievements/daily';
const achievements_path = (ids) => api_path + `/achievements?ids=${Array.from(ids).join(',')}`;

const currencyIndex = {}

const GuildWars2Api = {
  fetchDailyAchievements(done, err) {
    RequestWrapper.getJSON(hostname, daily_achievements_path, done, err);
  },

  fetchAchievementsData(ids, done, err) {
    //console.log(achievements_path(ids));
    RequestWrapper.getJSON(hostname, achievements_path(ids), done, err);
  },

  fetchDailyAchievementsWithMetadata(done, err) {
    //console.log('hey');
    this.fetchDailyAchievements((achievements) => {
      const ids = new Set(achievements.pve.map((achiev) => achiev.id));

      let achievementIndex = {}
      let numUpdated = 0;
      achievements.pve.forEach((achiev) => achievementIndex[achiev.id] = achiev);

      // TODO: lookup account status for each too
      this.fetchAchievementsData(ids, (metas) => {
        metas.forEach((meta) => {
          const id = meta.id;
          achievementIndex[id] = assign(achievementIndex[id], meta);
          numUpdated++;
          if (numUpdated === ids.size) {
            const res = Object.keys(achievementIndex).map((key) => achievementIndex[key]);
            done(res);
          }
        });
      }, err);
    }, err);
  },

  fetchCurrencies(ids, done, err) {
    //console.log(currencies_path(ids))
    RequestWrapper.getJSON(hostname, currencies_path(ids), done, err);
  },

  fetchWallet(done, err) {
    RequestWrapper.getJSON(hostname, wallet_path, (wallet) => {
      done(wallet);
    }, err);
  },

  fetchWalletWithMetadata(dbs, done, err) {
    let res = []
    this.fetchWallet((wallet) => {
      this.saveWalletRecord(dbs, wallet);
      res = wallet;
      let updated = 0;
      const toUpdate = wallet.length;
      const currencyIds = wallet.map((currency) => currency.id);
      this.fetchCurrencies(currencyIds, (currencies) => {
        currencies.forEach((currency, idx) => {
          res[idx] = assign(res[idx], currency);
        });
        done(res);
      }, err);
    }, err);
  },

  saveWalletRecord(dbs, wallet) {
    const gold = _find(wallet, (currency) => currency.id === 1)
    console.log(moment().format('l') + ": saving entry with " + (gold.value / 10000) + "G")

    const db = dbs.gw2;
    const coll = db.collection('wallet-records');

    const obj = {
      wallet,
      date: new Date()
    };

    coll.insertOne(obj);
  },

  fetchCombined(dbs, done, err) {
    let res = {};
    let walletLoaded = false;
    let achievementsLoaded = false;
    this.fetchDailyAchievementsWithMetadata((achievements) => {
      achievementsLoaded = true;
      res.achievements = achievements;
      //console.log(achievementsLoaded, walletLoaded);
      if (achievementsLoaded && walletLoaded) {
        done(res);
      }
    }, err);
    this.fetchWalletWithMetadata(dbs, (wallet) => {
      walletLoaded = true;
      res.wallet = wallet;
      //console.log(achievementsLoaded, walletLoaded);
      if (achievementsLoaded && walletLoaded) {
        done(res);
      }
    }, err);
  }
}

module.exports = GuildWars2Api;
