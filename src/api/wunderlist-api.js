const RequestWrapper = require('../request-wrapper')

const moment = require('moment')

const Config = require('../config');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(Config.getConfigDir() + 'wunderlist.properties');

const headers = {
  'X-Access-Token': properties.get('access.token'),
  'X-Client-ID': properties.get('client.id'),
  'content-type': 'application/json'
}

const lists = new Set(properties.get('lists').split(','))
const listIndex = {}

const hostname = 'a.wunderlist.com';
const api_path = '/api/v1';
const lists_path = '/lists';
const tasks_path = '/tasks';
const tasks_query = '?list_id=';
const subtasks_path = '/subtasks';

const INBOX_ID = 105779218;

const WunderlistApi = {
  getLists(done, err) {
    const res = [];
    RequestWrapper.getJSON(hostname, api_path + lists_path, (json) => {
      for (idx in json) {
        const list = json[idx];
        if (lists.has(list.title)) {
          listIndex[list.title] = list.id;
        }
      }
      //console.log(listIndex);
      for (let list of lists.keys()) {
        const id = listIndex[list];
        //console.log(api_path + tasks_path + task_query + id);
        RequestWrapper.getJSON(hostname, api_path + tasks_path + tasks_query + id, (json) => {
          //console.log(json);
          res.push({ id, title: list, tasks: json });
          if (res.length === lists.size) {
            done(res);
          }
        }, err, false, headers);
      }
    }, err, false, headers);
  },

  createSubtask(subtask, task_id, done, err) {
    RequestWrapper.post(hostname, api_path + subtasks_path, {
      task_id,
      title: subtask
    }, done, err, headers, false);
  },

  createNewTask(subtasks, done, err) {
    const title = `Shopping List ${moment().format('ddd, M/D')}`;
    RequestWrapper.post(hostname, api_path + tasks_path, {
      'list_id':INBOX_ID,
      title
    }, (task) => {
      const task_id = task.id;
      const createdSubtasks = [];
      const createdAllSubtasks = () => { createdSubtasks.length === subtasks.length };
      subtasks.forEach((subtask) => {
        this.createSubtask(subtask, task_id, (createdSubtask) => {
          createdSubtasks.push(createdSubtask);
          if (createdAllSubtasks()) done();
        }, err);
      })
    }, err, headers, false);
  }
}

module.exports = WunderlistApi;
