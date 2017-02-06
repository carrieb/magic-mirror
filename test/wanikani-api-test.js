const WanikaniApi = require('../src/api/wanikani-api');

WanikaniApi.getCombinedData(
  (json) => console.log('success', json),
  (err) => console.log('error', err.message)
);
