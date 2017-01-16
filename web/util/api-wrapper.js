import $ from 'jquery';

let lastWeatherResponse = null;

const ApiWrapper = {
  getCurrentTemp(callback) {
    $.ajax('/api/weather')
     .done((res) => {
       console.log('/weather response', res);
       callback(res.current_observation.temp_f);
     });
  }
}

export default ApiWrapper;
