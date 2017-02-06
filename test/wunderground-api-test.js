const WundergroundApi = require('../src/api/wunderground-api');

WundergroundApi.getCurrentWeather(
  (res) => console.log('result:', result),
  (err) => console.log('error:', err.message)
);
