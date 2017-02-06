const RequestWrapper = require('./request-wrapper')

const Config = require('../config');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(Config.getConfigDir() + 'wunderlist.properties');

const headers = {
  'X-Access-Token': properties.get('access.token'),
  'X-Client-ID': properties.get('client.id')
}

const lists = new Set(properties.get('lists').split(','))
const listIndex = {}

const hostname = 'a.wunderlist.com';
const api_path = '/api/v1';
const lists_path = '/lists';
const tasks_path = '/tasks?list_id=';

const WunderlistApi = {
  getLists(done, err) {
    const res = [];
    RequestWrapper.getJSON(hostname, api_path + lists_path, (json) => {
      //console.log(json);
      for (idx in json) {
        const list = json[idx];
        if (lists.has(list.title)) {
          listIndex[list.title] = list.id;
        }
      }
      //console.log(listIndex);
      for (let list of lists.keys()) {
        const id = listIndex[list];
        //console.log(api_path + tasks_path + id);
        RequestWrapper.getJSON(hostname, api_path + tasks_path + id, (json) => {
          //console.log(json);
          res.push({ id, title: list, tasks: json });
          if (res.length === lists.size) {
            done(res);
          }
        }, err, false, headers);
      }
    }, err, false, headers);
  }
}

module.exports = WunderlistApi;
