const RequestWrapper = require('./request-wrapper')

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('/Users/carolyn/projects/magic-mirror/config/wanikani.properties');

// Documentation: https://www.wanikani.com/api

const hostname = 'www.wanikani.com'
const api_path = `/api/user/${properties.get('api.key')}`
const study_queue_path = '/study-queue'

const WanikaniApi = {
  getStudyQueue(done, err) {
    RequestWrapper.getJSON(hostname, api_path + study_queue_path, done, err);
  }
}

module.exports = WanikaniApi;
