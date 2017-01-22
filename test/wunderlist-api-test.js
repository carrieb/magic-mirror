const WunderlistApi = require('../src/wunderlist-api')

WunderlistApi.getLists(
  (json) => console.log('success', json),
  (err) => console.log('error', err)
);
