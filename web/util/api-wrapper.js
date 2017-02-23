import $ from 'jquery';

let lastWeatherResponse = null;

const ApiWrapper = {
  getCurrentTemp(callback) {
    $.ajax('/api/weather')
     .done((res) => {
       console.log('/weather response', res);
       callback(res.current_observation);
     });
  },

  getForecast(callback) {
    $.ajax('/api/forecast')
      .done((res) => {
        console.log('/forecast response', res);
        callback(res.forecast.simpleforecast.forecastday);
      });
  },

  getWanikaniData(callback) {
    $.ajax('/api/wanikani')
      .done((res) => {
        console.log('/wanikani response', res);
        callback(res);
      });
  },

  getWunderlist(callback) {
    $.ajax('/api/wunderlist')
      .done((res) => {
        console.log('/wunderlist response', res);
        callback(res);
      });
  },

  getCalendars(callback) {
    $.ajax('/api/calendars')
     .done((res) => {
       console.log('/calendars response', res);
       callback(res);
     });
  },

  getGuildWarsData(callback) {
    $.ajax('/api/guildwars')
     .done((res) => {
       console.log('/guildwars response', res);
       callback(res);
     });
  },

  getGuildWarsWalletHistory(callback) {
    $.ajax('/api/guildwars/wallet')
    .done((res) => {
      console.log('/guildwars/wallet response', res);
      callback(res);
    });
  }
}

export default ApiWrapper;
