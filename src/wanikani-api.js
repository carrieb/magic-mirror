const RequestWrapper = require('./request-wrapper')

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('/Users/carolyn/projects/magic-mirror/config/wanikani.properties');

// Documentation: https://www.wanikani.com/api

const hostname = 'www.wanikani.com'
const api_path = `/api/user/${properties.get('api.key')}`
const user_info_path = '/user-information'

const WanikaniApi = {
  getUserInfo(done, err) {
    RequestWrapper.getJSON(hostname, api_path + user_info_path, done, err);
  }
}

module.exports = WanikaniApi;
