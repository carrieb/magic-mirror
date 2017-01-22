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

  getWanikaniStudyQueue(callback) {
    $.ajax('/api/wanikani-queue')
      .done((res) => {
        console.log('/wanikani-queue response', res);
        callback(res);
      });
  },

  getWunderlist(callback) {
    $.ajax('/api/wunderlist')
      .done((res) => {
        console.log('/wunderlist response', res);
        callback(res);
      });
  }
}

export default ApiWrapper;
