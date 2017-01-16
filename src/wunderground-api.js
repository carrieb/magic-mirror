const RequestWrapper = require('./request-wrapper')

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('/Users/carolyn/projects/magic-mirror/config/wunderground.properties');

const hostname = 'api.wunderground.com'
const api_path = `/api/${properties.get('key.id')}`
const conditions_path = `/conditions/q/${properties.get('default.state')}/${properties.get('default.city')}.json`

const WundergroundApi = {
  getCurrentWeather(done, err) {
    RequestWrapper.getJSON(hostname, api_path + conditions_path, done, err, false);
  }
}

module.exports = WundergroundApi;
