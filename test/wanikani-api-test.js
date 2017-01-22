const WanikaniApi = require('../src/wanikani-api');

WanikaniApi.getStudyQueue(
  (json) => console.log('success', json),
  (err) => console.log('error', err.message)
);
