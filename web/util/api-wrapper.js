import $ from 'jquery';

import assign from 'lodash/assign';

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
  },

  submitCrop(filename, crop, callback) {
    let data = { filename };
    data = assign(data, crop);
    $.ajax('/crop', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8'
    })
    .done((res) => {
      console.log('/crop response', res);
      callback(res);
    });
  },

  extractText(filename, callback) {
    $.ajax('/extract', { data: { filename }})
    .done((res) => {
      console.log('/extract response', res);
      callback(res);
    });
  },

  submitItems(items, callback) {
    $.ajax('/items', { data: JSON.stringify({ items }), type: 'POST', contentType: 'application/json; charset=utf-8'})
    .done((res) => {
      console.log('/items response', res);
      callback(res);
    });
  }
}

export default ApiWrapper;
