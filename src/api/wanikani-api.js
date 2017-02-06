const RequestWrapper = require('./request-wrapper')

const Config = require('../config');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader(Config.getConfigDir() + 'wanikani.properties');

// Documentation: https://www.wanikani.com/api

const hostname = 'www.wanikani.com'
const api_path = `/api/user/${properties.get('api.key')}`
const study_queue_path = '/study-queue'
const recent_unlocks_path = '/recent-unlocks/25'

const WanikaniApi = {
  getStudyQueue(done, err) {
    RequestWrapper.getJSON(hostname, api_path + study_queue_path, done, err);
  },

  getRecentUnlocks(done, err) {
    RequestWrapper.getJSON(hostname, api_path + recent_unlocks_path, done, err);
  },

  getCombinedData(done, err) {
    const combined = {}
    const doneIfComplete = () => {
      if (combined.user_information && combined.study_queue &&combined.recent_unlock) {
        done(combined);
      }
    }
    this.getStudyQueue((json) => {
      combined.user_information = json.user_information;
      combined.study_queue = json.requested_information;
      doneIfComplete();
    }, err);
    this.getRecentUnlocks((json) => {
      combined.user_information = json.user_information;
      const recent_unlocks = json.requested_information;
      combined.recent_unlock = recent_unlocks[Math.floor(Math.random() * recent_unlocks.length)];
      doneIfComplete();
    }, err);
  }
}

module.exports = WanikaniApi;
