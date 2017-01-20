const WanikaniApi = require('../src/wanikani-api');

WanikaniApi.getUserInfo(
  (json) => console.log('success', json),
  (err) => console.log('error', err.message)
);
