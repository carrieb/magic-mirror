const WunderlistApi = require('../src/api/wunderlist-api')

WunderlistApi.getLists(
  (json) => console.log('success', json),
  (err) => console.log('error', err)
);
