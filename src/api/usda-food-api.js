const Config = require('../config');
const RequestWrapper = require('../request-wrapper')

const PropertiesReader = require('properties-reader')
const properties = PropertiesReader(Config.getConfigDir() + 'usda-food.properties');

const hostname = 'api.nal.usda.gov';
const basicQuery = `?format=json&api_key=${properties.get('api.key')}`

const search_path = (q) =>  '/ndb/search/' + basicQuery + `&q=${encodeURIComponent(q)}&sort=r&max=25&offset=0`;
const retrieve_path = (ndbno) => '/ndb/reports/' + basicQuery + `&ndbno=${ndbno}&type=f`;

const searchForFood = (q, done, error) => {
  RequestWrapper.getJSON(hostname, search_path(q), (result) => {
    if (result.errors) {
      error(result.errors);
    } else {
      done(result);
    }
  }, error);
}

const retrieveFood = (ndbno, done, error) => {
  RequestWrapper.getJSON(hostname, retrieve_path(ndbno), done, error);
}

module.exports = {
  searchForFood,
  retrieveFood
}
