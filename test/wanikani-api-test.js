const WanikaniApi = require('../src/wanikani-api');

WanikaniApi.getCombinedData(
  (json) => console.log('success', json),
  (err) => console.log('error', err.message)
);
