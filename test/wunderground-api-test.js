const WundergroundApi = require('../src/wunderground-api');

WundergroundApi.getCurrentWeather(
  (res) => console.log('result:', result),
  (err) => console.log('error:', err.message)
);
